import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import path from "path";
import { buildSchema } from "type-graphql";
import { Post } from "./entities/Post";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    migrations: [path.join(__dirname, "./migrations")],
    entities: [Post],
  });

  console.log(conn);

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
};

main().catch(err => {
  console.error(err);
});
