import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function useAuthUser() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ id: string; email: string; nom?: string; idRole?: number } | null>(null);

    useEffect(() => {
        const supabase = createClient();

        const fetchUser = async () => {
            setIsLoading(true);

            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                console.log("Erreur ou pas d'utilisateur:", error?.message || "Aucune session active.");
                setUser(null);
                setIsLoading(false);
                return;
            }

            const { user } = data.session;
            const userId = user.id;
            const userEmail = user.email || "";

            const { data: userData, error: userError } = await supabase
                .from("Utilisateur")
                .select("nom, idRole")
                .eq("id", userId)
                .single();

            if (userError || !userData) {
                console.log("Erreur lors de la récupération de l'utilisateur:", userError?.message);
                setUser({ id: userId, email: userEmail });
            } else {
                setUser({ id: userId, email: userEmail, nom: userData.nom, idRole: userData.idRole });
            }

            setIsLoading(false);
        };

        fetchUser();
    }, []);

    return { user, isLoading };
}
