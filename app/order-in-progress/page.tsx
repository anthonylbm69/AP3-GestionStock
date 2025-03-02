"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {createClient} from "@/utils/supabase/client";

type Stock = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
};

export default function OrderInProgress() {
    const router = useRouter();
    const [cart, setCart] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);


    const supabase = createClient();

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            console.log("Utilisateur récupéré :", data, "Erreur :", error);

            if (error || !data?.user) {
                console.error("Utilisateur non connecté !");
                router.push("/login");
                return;
            }

            const userId = data.user.id;

            const { data: userData, error: userError } = await supabase
                .from("Utilisateur")
                .select("id")
                .eq("id", userId)
                .single();

            if (userError) {
                console.error("Erreur lors de la récupération de l'ID utilisateur :", userError);
            } else {
                setUserId(userData.id);
            }
        };

        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!userId) {
            alert("Utilisateur non authentifié !");
            return;
        }

        setLoading(true);

        const { data: commande, error: commandeError } = await supabase
            .from("Commande")
            .insert([{ idUtilisateur: userId, dateCommande: new Date() }])
            .select("id")
            .single();

        if (commandeError) {
            console.error("Erreur lors de la création de la commande :", commandeError);
            setLoading(false);
            return;
        }

        const commandeId = commande.id;

        const detailsCommandeData = cart.map((item) => ({
            idCommande: commandeId,
            idStock: item.id,
            quantite: item.quantity,
        }));

        const { error: detailsError } = await supabase.from("DetailsCommande").insert(detailsCommandeData);

        if (detailsError) {
            console.error("Erreur lors de l'ajout des détails de commande :", detailsError);
            setLoading(false);
            return;
        }

        for (const item of cart) {
            const { data: stockData, error: stockError } = await supabase
                .from("Stock")
                .select("quantiteDisponible")
                .eq("id", item.id)
                .single();

            if (stockError || !stockData) {
                console.error("Erreur lors de la récupération du stock :", stockError);
                continue;
            }

            const newQuantity = stockData.quantiteDisponible - item.quantity;

            if (newQuantity < 0) {
                console.error(`Stock insuffisant pour ${item.name} !`);
                alert(`Stock insuffisant pour ${item.name} !`);
                return;
            }

            const { error: updateError } = await supabase
                .from("Stock")
                .update({ quantiteDisponible: newQuantity })
                .eq("id", item.id);

            if (updateError) {
                console.error("Erreur lors de la mise à jour du stock :", updateError);
            }
        }


        localStorage.removeItem("cart");

        setLoading(false);
        alert("Commande passée avec succès !");
        router.push("/order-passed");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 mt-10">Récapitulatif de la commande</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <table className="border border-gray-200 w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Nom</th>
                            <th className="p-2">Quantité</th>
                            <th className="p-2">Prix (€)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2">{item.price} €</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p className="text-lg font-semibold">
                        Total : {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} €
                    </p>
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                    >
                        {loading ? "Paiement en cours..." : "Payer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
