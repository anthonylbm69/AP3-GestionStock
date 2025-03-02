/*
  Warnings:

  - You are about to drop the column `email` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `motDePasse` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Utilisateur_email_key";

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "email",
DROP COLUMN "motDePasse";
