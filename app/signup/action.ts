"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nom = formData.get("lastname") as string;
    const prenom = formData.get("firstname") as string;

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError || !authData?.user) {
        console.error("Erreur lors de l'inscription :", authError);
        redirect("/error");
        return;
    }

    const userId = authData.user.id;
    const defaultRoleId = 2;

    const { error: dbError } = await supabase.from("Utilisateur").insert([
        {
            id: userId, 
            nom,
            prenom,
            idRole: defaultRoleId,
        },
    ]);

    if (dbError) {
        console.error("Erreur lors de l'ajout de l'utilisateur en base :", dbError);
        redirect("/error");
        return;
    }

    revalidatePath("/", "layout");
    redirect("/");
}
