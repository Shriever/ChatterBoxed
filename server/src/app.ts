import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import path from "path";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { buildSchema } from "type-graphql";
import { Post } from "./entities/Post";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from './constants';
import { MyContext } from './types';
import cors from 'cors';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, './migrations')],
    entities: [Post, User],
  });
  `${conn}`;

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  // app.use(
  //   cors({
  //     origin: 'https://studio.apollographql.com',
  //     credentials: true,
  //   })
  // );

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10  years
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.ACCESS__TOKEN_SECRET || 'amaZiNg sEcrEt',
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
  });
};

main().catch(err => {
  console.error(err);
});
