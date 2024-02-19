import { Thread as IThread, User } from "@prisma/client";

export type VoteType = "UP" | "DOWN";

export type ltree = string;

/**
 * @field totalvotes [up,down]
 *
 */
export type MissingKeys = {
  node_path: ltree;
  voted: VoteType | null;
  totalvotes: number[];
  saved: boolean;
  totalcomments?: number;
};

/**
 * @description {type} of `Thread` and `User` join
 */
export type Thread = IThread &
  Partial<MissingKeys> & {
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

export type TypeImageUpload =
  | "avatar"
  | "background_image"
  | "header_image"
  | null;
