/*
  Warnings:

  - A unique constraint covering the columns `[idAuthSupabase]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idAuthSupabase` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "idAuthSupabase" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_idAuthSupabase_key" ON "Utilisateur"("idAuthSupabase");
