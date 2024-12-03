import { BaseClientOptions } from "@xata.io/client";

import { XataClient } from "./xata";

const defaultOptions = {
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH,
};

let instance: XataClient | undefined = undefined;

export const getXataClient = (options: BaseClientOptions) => {
  if (instance) return instance;

  instance = new XataClient(options);
  return instance;
};

export const query = getXataClient(defaultOptions);
