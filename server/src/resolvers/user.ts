import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { hash } from "argon2";

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password);
    await User.create({ username, password: hashedPassword }).save();
    return "bye";
  }
}
