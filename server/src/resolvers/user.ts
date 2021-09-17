import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { User } from '../entities/User';
import { hash, verify } from 'argon2';
import { MyContext } from 'src/types';

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
class usernamePasswordInput {
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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    const { userId } = req.session;
    if (!userId) {
      return null;
    }

    return User.findOne(userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: usernamePasswordInput,
    @Ctx() {req}: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;
    if (username.length < 3) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username must be at least 3 characters long.',
          },
        ],
      };
    }
    if (password.length < 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Password must be at least 3 characters long.',
          },
        ],
      };
    }
    const hashedPassword = await hash(password);
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      }).save();

      req.session.userId = user.id;

      return { user };
    } catch (error) {
      if (error.detail.includes('already exists')) {
        return {
          errors: [{ field: 'username', message: 'Username already exists.' }],
        };
      }
      return { errors: [{ field: 'register', message: 'unknown' }] };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: usernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return {
        errors: [{ field: 'login', message: 'Could not login' }],
      };
    }
    const isValid = verify(user.password, password);

    if (!isValid) {
      return {
        errors: [{ field: 'login', message: 'Wrong password' }],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
