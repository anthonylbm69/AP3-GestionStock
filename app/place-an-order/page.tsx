'use client';
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {useRouter} from "next/navigation";

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
            const { data, error } = await supabase
                .from("Stock")
                .select("*");
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

    const addToCart = (medicament: Stock) => {
        const exists = cart.find((item) => item.id === medicament.id);
        if (exists) {
            setCart(cart.map((item) =>
                item.id === medicament.id
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...medicament, quantity: 1 }]);
        }
    };

    const removeOneFromCart = (id: number) => {
        const item = cart.find((medicament) => medicament.id === id);
        if (item) {
            if (item.quantity && item.quantity > 1) {
                setCart(cart.map((medicament) =>
                    medicament.id === id
                        ? { ...medicament, quantity: medicament.quantity - 1 }
                        : medicament
                ));
            } else {
                removeFromCart(id);
            }
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const totalCost = cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    const placeOrder = async () => {
        /*await supabase
            .from("Commande")
            .insert([
                {
                    idUtilisateur: 1, // Remplacez par l'ID de l'utilisateur connecté
                    total: totalCost,
                    dateCommande: new Date(),
                },
            ])
            .single(); // Retourne une seule commande*/
        router.push('/order-in-progress')

    };

    const handleQuantityChange = (e, itemId) => {
        const newQuantity = parseInt(e.target.value, 10);

        if (isNaN(newQuantity) || newQuantity < 1) {
            return;
        }
        setCart(cart.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    if (loading) {
        return <p>Chargement des données...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Interface de Commande</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-2">Médicaments et matériels disponibles</h2>
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
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) => handleQuantityChange(e, item.id)}
                                            className="w-16 text-center border px-2 py-1 rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => removeOneFromCart(item.id)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="px-2 py-1 text-red-500 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4">
                        <p className="text-lg font-semibold">
                            Total : {totalCost.toFixed(2)} €
                        </p>
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
