"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;

    if (!email || !password || !firstname || !lastname) {
        console.error("Tous les champs sont obligatoires !");
        return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });

    if (existingUser) {
        console.error("Cet email est déjà utilisé !");
        return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const newUser = await prisma.utilisateur.create({
        data: {
            nom: lastname,
            prenom: firstname,
            email,
            motDePasse: hashedPassword,
            idRole: 2,
        },
    });

    console.log("Utilisateur créé :", newUser);

    // Générer un token JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    console.log("Token JWT généré :", token);

    revalidatePath("/");
    redirect("/");
}
