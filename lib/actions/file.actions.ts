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
      url: constructFileUrl(bucketFile.$id),
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

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  //makes query to appwrite. Check if currentUser is owner of file and if the email has access to other files (files have an email array of emails that can access it)
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      //contains because we're searching for many, and not just one like the above
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  //now, if the type of file is equal to one of the known types, change URL and search
  //this is used in getFiles to get their type too, not just the full file
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  //sortby = $createdAt. orderBy = desc. Both are inside getFiles param "sort"
  const [sortBy, orderBy] = sort.split("-");

  //this is an if statement. sortBy can be tittle, name, type...
  queries.push(
    orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
  );

  console.log(queries);

  return queries;
};

//first creates admin permissions and brings current user, then create query to req
export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    // console.log({ currentUser, queries });

    //gathers all files from this database and this collection from appwrite
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionsId,
      queries
    );

    // console.log({ files });

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    //take from frontend the name and extension you just chose
    const newName = `${name}.${extension}`;
    //use a appwrite function where you pass the IDs of where to change, which file, and what to change with what
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionsId,
      fileId,
      { name: newName }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename files");
  }
};

//a copy of renameUser, only it doesn't take anything from frontend, and only changes "emails"
export const updatedFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    //use a appwrite function where you pass the IDs of where to change, which file, and what to change with what
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionsId,
      fileId,
      { users: emails }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename files");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    //use a appwrite function where you pass the IDs of where to change, which file, and what to change with what
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionsId,
      fileId
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to rename files");
  }
};
