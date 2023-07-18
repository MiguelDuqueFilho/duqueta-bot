/*
  Warnings:

  - Added the required column `broadcaster_type` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offline_image_url` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "email" TEXT,
    "login" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "broadcaster_type" TEXT NOT NULL,
    "profile_image_url" TEXT NOT NULL,
    "offline_image_url" TEXT NOT NULL,
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
