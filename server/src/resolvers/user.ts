import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import { hash, verify } from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const { username, password } = options;
    if (username.length < 3) {
      return {
        errors: [
          {
            field: "Username",
            message: "Username must be at least 3 characters long.",
          },
        ],
      };
    }
    if (password.length < 3) {
      return {
        errors: [
          {
            field: "Password",
            message: "Password must be at least 3 characters long.",
          },
        ],
      };
    }
    const hashedPassword = await hash(password);
    const user = await User.create({
      username,
      password: hashedPassword,
    }).save();
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const { username, password } = options;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return {
        errors: [{ field: "login", message: "Could not login" }],
      };
    }
    const isValid = verify(user.password, password);

    if (!isValid) {
      return {
        errors: [{ field: "login", message: "Wrong password" }],
      };
    }

    return { user };
  }
}
