// lib/appwrite/appwrite-client.ts
import { Storage } from "appwrite";
import { Client } from "appwrite";
import { appwriteConfig } from "./config";

// Client para o lado do navegador (sem privilégios admin)
const client = new Client()
  .setEndpoint(appwriteConfig.endpointURL!)
  .setProject(appwriteConfig.projectId!);

export const storage = new Storage(client);

// Gera URL para visualização no client-side
export const getFileViewUrl = (fileId: string): string => {
  return storage.getFileView(appwriteConfig.bucketId!, fileId);
};

// Gera URL para download no client-side
export const getFileDownloadUrl = (fileId: string): string => {
  return storage.getFileDownload(appwriteConfig.bucketId!, fileId);
};
