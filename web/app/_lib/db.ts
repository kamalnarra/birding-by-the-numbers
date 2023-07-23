import { MongoClient, ObjectId } from "mongodb";

export const clientPromise = new MongoClient(
  process.env.DB_URI as string
).connect();

export interface User {
  email: string;
  ebirdUsername?: string;
  ebirdPassword?: string;
  birds?: {
    id: string;
    name: string;
  }[];
  updated?: string;
}

export const users = clientPromise.then((client) =>
  client.db("birding-by-the-numbers").collection<User>("users")
);
