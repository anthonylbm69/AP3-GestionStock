/*
  Warnings:

  - The primary key for the `Utilisateur` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_idUtilisateur_fkey";

-- AlterTable
ALTER TABLE "Commande" ALTER COLUMN "idUtilisateur" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(120),
ADD CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Utilisateur_id_seq";

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
