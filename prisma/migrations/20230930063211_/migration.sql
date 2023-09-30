/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `MenuItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MenuItems_shortCode_key" ON "MenuItems"("shortCode");
