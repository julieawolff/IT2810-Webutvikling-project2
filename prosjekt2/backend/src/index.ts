import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { typeDefs } from "./typeDefs.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a new Neo4j driver instance
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

try {
  const schema = await neoSchema.getSchema();

  // Create Apollo Server instance with the schema
  const server = new ApolloServer({
    schema,
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      return { driver };
    },
    listen: { port: 3001 },
  });

  console.log("🚀 Server ready at:", url);
} catch (error) {
  console.error("Failed to start server:", error);
}
