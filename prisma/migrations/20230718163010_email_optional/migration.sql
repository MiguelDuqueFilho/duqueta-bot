/*
  Warnings:

  - Added the required column `scope` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AccessToken" (
    "user_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "AccessToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AccessToken" ("access_token", "created_at", "updated_at", "user_id") SELECT "access_token", "created_at", "updated_at", "user_id" FROM "AccessToken";
DROP TABLE "AccessToken";
ALTER TABLE "new_AccessToken" RENAME TO "AccessToken";
CREATE UNIQUE INDEX "AccessToken_user_id_key" ON "AccessToken"("user_id");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "email" TEXT,
    "login" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "profile_image_url" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL,
    "twitch_created_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "description", "display_name", "email", "id", "login", "profile_image_url", "twitch_created_at", "type", "user_id", "view_count") SELECT "created_at", "description", "display_name", "email", "id", "login", "profile_image_url", "twitch_created_at", "type", "user_id", "view_count" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
