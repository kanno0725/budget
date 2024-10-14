/*
  Warnings:

  - You are about to drop the column `userGroupName` on the `UserGroups` table. All the data in the column will be lost.
  - Added the required column `name` to the `UserGroups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGroups" DROP COLUMN "userGroupName",
ADD COLUMN     "name" TEXT NOT NULL;
