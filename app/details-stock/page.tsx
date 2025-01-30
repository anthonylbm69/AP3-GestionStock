'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';

type Stock = {
    id: number;
    nom: string;
    description: string;
    quantiteDisponible: number;
    type: string;
    prix: number;
};

export default function DetailsStock() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stockId = searchParams.get("id");

    const [stock, setStock] = useState<Stock | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!stockId) {
            console.error("Aucun ID de stock trouvé dans l'URL");
            setLoading(false); // Sortir du chargement
            return;
        }

        const stockIdNumber = parseInt(stockId);
        if (isNaN(stockIdNumber)) {
            console.error("L'ID du stock n'est pas un nombre valide:", stockId);
            setLoading(false);
            return;
        }

        console.log("Requête pour l'ID du stock:", stockIdNumber);

        const fetchStockDetails = async () => {
            const { data, error } = await supabase
                .from('Stock')
                .select('*')
                .eq('id', stockIdNumber)
                .single();

            console.log("Réponse Supabase:", data, error);

            if (error) {
                console.error("Erreur lors de la récupération des détails du stock :", error);
                setLoading(false);
            } else {
                setStock(data);
                setLoading(false);
            }
        };

        fetchStockDetails();
    }, [stockId]);

    if (loading) return <p className="text-center mt-20">Chargement des détails...</p>;
    if (!stock) return <p className="text-center mt-20 text-red-500">Stock non trouvé</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Détails du Stock</h2>
            <div className="space-y-3">
                <p><strong>Nom :</strong> {stock.nom}</p>
                <p><strong>Description :</strong> {stock.description}</p>
                <p><strong>Quantité Disponible :</strong> {stock.quantiteDisponible}</p>
                <p><strong>Type :</strong> {stock.type}</p>
                <p><strong>Prix :</strong> {stock.prix} €</p>
            </div>
            <button
                onClick={() => router.back()}
                className="mt-5 w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-md">
                Retour
            </button>
        </div>
    );
}
