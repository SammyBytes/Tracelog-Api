import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

/**
 * Database schema definition for Tracelog application
 */
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});
/**
 * Authors of commits
 */
export const authors = sqliteTable("authors", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
});
/**
 * Commits made to projects
 */
export const commits = sqliteTable("commits", {
  hash: text("hash").primaryKey(),
  projectId: text("project_id").references(() => projects.id),
  authorEmail: text("author_email").references(() => authors.email),

  // Analize message: feat(auth): add login
  type: text("type"), // feat, fix, refactor, etc.
  module: text("module"), // auth, ui, api, etc.
  message: text("message").notNull(),

  fullMessage: text("full_message"), // Full commit message
  prNumber: integer("pr_number"), // Associated PR number
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});
/**
 * Files changed in each commit
 */
export const commitFiles = sqliteTable("commit_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  commitHash: text("commit_hash").references(() => commits.hash),
  path: text("path").notNull(), // File Path: src/modules/auth/service.ts
  changeType: text("change_type"), // added, modified, deleted
});
