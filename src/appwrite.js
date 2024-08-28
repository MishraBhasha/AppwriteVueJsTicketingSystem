import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66cc0f69002cd2a28ae6"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export { client };