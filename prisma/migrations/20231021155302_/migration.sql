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
    "imageUrl" TEXT NOT NULL DEFAULT 'https://placehold.co/400'
);
INSERT INTO "new_MenuItems" ("createdAt", "description", "id", "imageUrl", "name", "price", "shortCode", "updatedAt") SELECT "createdAt", "description", "id", "imageUrl", "name", "price", "shortCode", "updatedAt" FROM "MenuItems";
DROP TABLE "MenuItems";
ALTER TABLE "new_MenuItems" RENAME TO "MenuItems";
CREATE UNIQUE INDEX "MenuItems_shortCode_key" ON "MenuItems"("shortCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
