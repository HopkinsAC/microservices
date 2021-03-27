import { ApolloServer } from "apollo-server-express";
import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import formatGraphQLErrors from "./formatGraphQLErrors";
import resolvers from "#root/graphql/resolvers";
import schema from "#root/graphql/schema";
import { ParseError } from "got/dist/source";

const PORT = config.get("PORT") as number;

const startServer = () => {
  const apolloServer = new ApolloServer({
    context: a => a,
    formatError: formatGraphQLErrors,
    resolvers,
    typeDefs: schema
  });

  const app = express();

  app.use(cookieParser());
  app.use(cors({
    credentials: true,
    origin: (origin, cb) => cb(null, true)
  }));

  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: "/graphql"
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chat-Gateway listening on port ${PORT}`);
  });
};

export default startServer;
