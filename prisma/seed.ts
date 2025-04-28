import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            { id: 1, nom: 'admin' },
            { id: 2, nom: 'utilisateur' },
            { id: 3, nom: 'gestionnaire' },
        ],
        skipDuplicates: true,
    });
    await prisma.utilisateur.upsert({
        where: { id: "1" },
        update: {},
        create: {
            nom: "Lyb",
            prenom: "Anto",
            idRole: 1,
        },
    });

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
