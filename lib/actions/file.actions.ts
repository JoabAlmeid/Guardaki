"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  //get full permissions
  const { storage, databases } = await createAdminClient();

  try {
    //reads file "from the buffer"
    const inputFile = InputFile.fromBuffer(file, file.name);

    //stores it. Bucket means "where is the file". Give it an adress, ID, and what it is
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    //this is mostly creating metadata that we are attaching to the file
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      // url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    //storing the metadata
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionsId,
        ID.unique(),
        fileDocument
      )
      //if something goes wrong, just delete from this bucket this file
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });
    //reloads the page. Shows refreshed data
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (currentUser: Models.Document) => {
  //makes query to appwrite. Check if currentUser is owner of file and if the email has access to other files (files have an email array of emails that can access it)
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      //contains because we're searching for many, and not just one like the above
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  //TODO: functions like SEARCH, SORT, LIMITS...

  return queries;
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser);

    console.log({ currentUser, queries });

    //gathers all files from this database and this collection from appwrite
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionsId,
      queries
    );

    console.log({ files });

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};
