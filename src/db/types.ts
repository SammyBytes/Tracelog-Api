import { projects, authors, commits, commitFiles } from "./schema";
import {
  SQLiteTransaction,
  BaseSQLiteDatabase as SQLiteDatabase,
} from "drizzle-orm/sqlite-core";

export type NewProject = typeof projects.$inferInsert;
export type NewAuthor = typeof authors.$inferInsert;
export type NewCommit = typeof commits.$inferInsert;
export type NewCommitFile = typeof commitFiles.$inferInsert;

export type DatabaseOrTransaction =
  | SQLiteDatabase<"async", any, any, any>
  | SQLiteTransaction<"async", any, any, any>;
