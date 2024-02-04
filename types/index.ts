import { Thread as IThread, User } from "@prisma/client";

export type ltree = string;
export type MissingKeys = {
  node_path: ltree;
};

/**
 * @description {type} of `Thread` and `User` join
 */
export type Thread = IThread & {
  user: User;
};

/**
 * @description {type} of `Thread` and `User` join without nested objects
 */
export type RawThread = IThread & MissingKeys & RawUserWithPrefix;

/**
 * @description {type} `User` type with **user_** prefix
 */
export type RawUserWithPrefix = {
  user_id: string;
  user_name: string;
  user_image: string;
};

/**
 * @description tree representaion of a thread
 */
export type NestedThread = Thread & MissingKeys & { children: NestedThread[] };
