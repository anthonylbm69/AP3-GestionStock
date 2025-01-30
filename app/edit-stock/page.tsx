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

export default function EditOneStock() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stockId = searchParams.get("id");

    const [stock, setStock] = useState<Stock | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Stock>({
        id: 0,
        nom: '',
        description: '',
        quantiteDisponible: 0,
        type: '',
        prix: 0,
    });

    // Charger les données du stock à éditer
    useEffect(() => {
        if (!stockId) return;

        const fetchStockDetails = async () => {
            const { data, error } = await supabase
                .from('Stock')
                .select('*')
                .eq('id', parseInt(stockId)) // Assurez-vous de convertir l'ID en nombre
                .single();

            if (error) {
                console.error("Erreur lors de la récupération des détails du stock :", error);
            } else {
                setStock(data);
                setFormData(data); // Remplir le formulaire avec les données existantes
            }
            setLoading(false);
        };

        fetchStockDetails();
    }, [stockId]);

    // Fonction pour gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase
            .from('Stock')
            .update(formData)
            .eq('id', formData.id);

        if (error) {
            console.error("Erreur lors de la mise à jour du stock :", error);
        } else {
            router.push('/'); // Redirige vers la page principale après la mise à jour
        }
    };

    if (loading) return <p>Chargement des données...</p>;
    if (!stock) return <p>Stock non trouvé</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Modifier le Stock</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="quantiteDisponible" className="block text-sm font-medium text-gray-700">Quantité Disponible</label>
                    <input
                        type="number"
                        id="quantiteDisponible"
                        name="quantiteDisponible"
                        value={formData.quantiteDisponible}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="prix" className="block text-sm font-medium text-gray-700">Prix (€)</label>
                    <input
                        type="number"
                        id="prix"
                        name="prix"
                        value={formData.prix}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Enregistrer
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
