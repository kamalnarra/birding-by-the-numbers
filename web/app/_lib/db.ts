import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.DB_URI as string).connect();

export interface User {
  email: string;
  name: string;
  ebirdUsername?: string;
  ebirdPassword?: string;
  birds?: {
    taxon_order: string;
    category: string;
    common_name: string;
    scientific_name: string;
    location: string;
    "s/p": string;
    date: string;
    locid: string;
    subid: string;
    countable: string;
    latitude: string;
    longitude: string;
  }[];
  lastUpdated: number;
}

export const users = client.then((client) =>
  client.db("birding-by-the-numbers").collection<User>("users"),
);
