import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

import { ulid } from "ulid";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),

  type: text("type").notNull().default("user"), // user or organization
  url: text("url"),
  apiKeyHash: text("api_key_hash").unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

/**
 * Database schema definition for Tracelog application
 */
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  accountId: text("account_id").references(() => accounts.id),
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
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
});
/**
 * Commits made to projects
 */
export const commits = sqliteTable("commits", {
  hash: text("hash").primaryKey(),
  projectId: text("project_id").references(() => projects.id),
  authorId: text("author_id").references(() => authors.id),

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

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => accounts.id),
});

export const oauthAccounts = sqliteTable("oauth_accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => accounts.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});