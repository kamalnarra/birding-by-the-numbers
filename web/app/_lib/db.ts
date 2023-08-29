import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.DB_URI as string).connect();

export interface User {
  email: string;
  name: string;
  ebirdUsername?: string;
  ebirdPassword?: string;
  birds?: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    locationName: string;
  }[];
  updated?: string;
}

export const users = client.then((client) =>
  client.db("birding-by-the-numbers").collection<User>("users"),
);
