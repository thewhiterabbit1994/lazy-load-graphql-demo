import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { createServer } from "http";
import { readFileSync } from 'fs'
import path from 'path'
// import './run-db'

// import _applyMiddlewares from "./middlewares";

export default async function startApolloServer({ typeDefs, resolvers, port = 3000 }) {
  const app = express();

  const httpServer = createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
}

const typeDefs = readFileSync(path.join(process.cwd(), 'src/schema.graphql'), { encoding: "utf8" })

console.log(typeDefs)

const resolvers = {
  Query: {
    getArray: (_, {page = 0}) => {
      return Array.from({length: 10}).map((_, i) => (page * 10) + i + 1)
    }
  }
}

startApolloServer({typeDefs, resolvers, port: 4000})