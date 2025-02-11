"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"; // Import pour gérer les cookies

export async function signin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        console.error("Email et mot de passe obligatoires !");
        return;
    }

    const user = await prisma.utilisateur.findUnique({ where: { email } });

    if (!user) {
        console.error("Utilisateur non trouvé !");
        return;
    }

    const isMatch = await bcrypt.compare(password, user.motDePasse);

    if (!isMatch) {
        console.error("Mot de passe incorrect !");
        return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    console.log("Connexion réussie, token JWT :", token);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    });

    console.log("Token JWT stocké dans le cookie:", token);
    console.log("Liste des cookies après set:", cookieStore.getAll());

    revalidatePath("/");
    redirect("/");
}
