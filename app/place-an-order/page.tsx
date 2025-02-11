'use client'
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useRouter } from "next/navigation";

type Stock = {
    id: number;
    name: string;
    description: string;
    availableQuantity: number;
    price: number;
    quantity?: number;
};

const OrderInterface = () => {
    const [medicaments, setMedicaments] = useState<Stock[]>([]);
    const [cart, setCart] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMedications = async () => {
            const { data, error } = await supabase.from("Stock").select("*");
            if (error) {
                console.error("Erreur lors de la récupération des médicaments : ", error);
            } else {
                setMedicaments(
                    data?.map((item: any) => ({
                        id: item.id,
                        name: item.nom,
                        description: item.description,
                        availableQuantity: item.quantiteDisponible,
                        price: item.prix,
                    })) || []
                );
            }
            setLoading(false);
        };

        fetchMedications();
    }, []);

    // Charger le panier depuis localStorage au montage du composant
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque mise à jour
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (medicament: Stock) => {
        const exists = cart.find((item) => item.id === medicament.id);
        if (exists) {
            setCart(cart.map((item) =>
                item.id === medicament.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            ));
        } else {
            setCart([...cart, { ...medicament, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const totalCost = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const placeOrder = () => {
        router.push('/order-in-progress');
    };

    if (loading) {
        return <p>Chargement des données...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Interface de Commande</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-2">Médicaments disponibles</h2>
                    <Table className="border border-gray-200">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Prix (€)</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicaments.map((stock) => (
                                <TableRow key={stock.id}>
                                    <TableCell>{stock.name}</TableCell>
                                    <TableCell>{stock.description}</TableCell>
                                    <TableCell>{stock.price} €</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => addToCart(stock)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Ajouter
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Panier</h2>
                    <Table className="border border-gray-200">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">Supprimer</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Total : {totalCost.toFixed(2)} €</p>
                    </div>
                    <button
                        onClick={placeOrder}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                    >
                        Passer la commande
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderInterface;
