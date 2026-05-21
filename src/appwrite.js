import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("6a077abb0003a061044b"); // paste your project ID here

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };