// lib/appwrite/server-client.ts
import { Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
  .setEndpoint(appwriteConfig.endpointURL)
  .setProject(appwriteConfig.projectId)
  .setKey(appwriteConfig.secretKey);

export const databases = new Databases(client);
export const storage = new Storage(client);
