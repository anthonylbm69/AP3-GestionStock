/*
  Warnings:

  - The values [validee,invalidee] on the enum `CommandeStatut` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommandeStatut_new" AS ENUM ('en_attente', 'valide', 'invalide');
ALTER TABLE "Commande" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "Commande" ALTER COLUMN "statut" TYPE "CommandeStatut_new" USING ("statut"::text::"CommandeStatut_new");
ALTER TYPE "CommandeStatut" RENAME TO "CommandeStatut_old";
ALTER TYPE "CommandeStatut_new" RENAME TO "CommandeStatut";
DROP TYPE "CommandeStatut_old";
ALTER TABLE "Commande" ALTER COLUMN "statut" SET DEFAULT 'en_attente';
COMMIT;
