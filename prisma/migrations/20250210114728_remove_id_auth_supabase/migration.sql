/*
  Warnings:

  - You are about to drop the column `idAuthSupabase` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Utilisateur_idAuthSupabase_key";

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "idAuthSupabase";
