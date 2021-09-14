"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const Post_1 = require("./entities/Post");
const main = async () => {
    const conn = await (0, typeorm_1.createConnection)({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        migrations: [path_1.default.join(__dirname, "./migrations")],
        entities: [Post_1.Post],
    });
    conn.query("");
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [""],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    app.listen(PORT, () => {
        console.log("listening on port " + PORT);
    });
};
main().catch(err => {
    console.error(err);
});
//# sourceMappingURL=app.js.map