import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    console.log("Résultat de l'inscription :", data, error); // ✅ Vérifie la réponse

    if (error) {
        console.error('Erreur d’inscription:', error.message);
        redirect('/error');
        return;
    }

    if (data.user) {
        const { error: profileError } = await supabase
            .from('Utilisateur')
            .insert([
                {
                    nom: lastname,
                    prenom: firstname,
                    email: email,
                    motDePasse: password,
                    idRole: 2,
                },
            ]);
        console.log("Erreur d'insertion dans Utilisateur :", profileError); 

        if (profileError) {
            console.error('Erreur lors de l’ajout du profil:', profileError.message);
            redirect('/error');
            return;
        }
    }

    revalidatePath('/');
    redirect('/');
}
