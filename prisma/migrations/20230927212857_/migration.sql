/*
  Warnings:

  - Added the required column `description` to the `MenuItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `MenuItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortCode` to the `MenuItems` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);
INSERT INTO "new_MenuItems" ("createdAt", "id", "name", "price", "updatedAt") SELECT "createdAt", "id", "name", "price", "updatedAt" FROM "MenuItems";
DROP TABLE "MenuItems";
ALTER TABLE "new_MenuItems" RENAME TO "MenuItems";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
