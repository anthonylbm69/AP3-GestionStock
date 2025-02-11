'use client'
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
import { useRouter } from "next/navigation";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

type Stock = {
    id: number;
    nom: string;
    description: string;
    quantiteDisponible: number;
    type: string;
    prix: number;
};

const EditStock = () => {
    const router = useRouter();
    const [stock, setStock] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newStock, setNewStock] = useState<Partial<Stock>>({
        nom: "",
        description: "",
        quantiteDisponible: 0,
        type: "",
        prix: 0,
    });

    useEffect(() => {
        const fetchStock = async () => {
            const { data, error } = await supabase
                .from("Stock")
                .select("*");
            if (error) {
                console.error("Erreur lors de la récupération du stock : ", error);
            } else {
                setStock(data || []);
            }
            setLoading(false);
        };

        fetchStock();
    }, []);

    const handleEdit = (id: number) => {
        router.push(`/edit-stock?id=${id}`);
    };

    const handleView = (id: number) => {
        router.push(`/details-stock?id=${id}`);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedStockId(id);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        if (selectedStockId !== null) {
            const { error } = await supabase
                .from("Stock")
                .delete()
                .match({ id: selectedStockId });

            if (error) {
                console.error("Erreur lors de la suppression : ", error);
            } else {
                setStock(stock.filter(item => item.id !== selectedStockId));
                setShowPopup(false);
                setSelectedStockId(null);
            }
        }
    };

    const handleAddStock = async () => {
        const { data, error } = await supabase
            .from("Stock")
            .insert([newStock])
            .select();

        if (error) {
            console.error("Erreur lors de l'ajout du stock : ", error);
        } else if (data) {
            setStock([...stock, ...data]);
            setShowAddPopup(false);
            setNewStock({
                nom: "",
                description: "",
                quantiteDisponible: 0,
                type: "",
                prix: 0,
            });
        }
    };


    if (loading) {
        return <p>Chargement des données...</p>;
    }

    return (
        <div>
            <Table className="border border-gray-200 mt-20">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantité Disponible</TableHead>
                        <TableHead>Prix (en €)</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stock.map((stocks) => (
                        <TableRow key={stocks.id}>
                            <TableCell>{stocks.nom}</TableCell>
                            <TableCell>{stocks.description}</TableCell>
                            <TableCell>{stocks.quantiteDisponible}</TableCell>
                            <TableCell>{stocks.prix} €</TableCell>
                            <TableCell className="flex gap-4">
                                <button onClick={() => handleDeleteClick(stocks.id)} className="text-red-500 hover:text-red-700">
                                    <FaRegTrashAlt size={20} />
                                </button>
                                <button onClick={() => handleEdit(stocks.id)} className="text-blue-500 hover:text-blue-700">
                                    <CiEdit size={22} />
                                </button>
                                <button onClick={() => handleView(stocks.id)} className="text-green-500 hover:text-green-700">
                                    <FaEye size={20} />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-2 flex justify-center">
                <button className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400" onClick={() => setShowAddPopup(true)}>
                    Ajouter un Article
                </button>
            </div>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="mb-4 text-lg font-semibold">Voulez-vous vraiment supprimer cet élément ?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                        <h2 className="text-xl font-bold mb-4">Ajouter un Stock</h2>
                        <div className="text-left space-y-3">
                            <div>
                                <label htmlFor="nom" className="block font-medium">Nom</label>
                                <input id="nom" type="text" placeholder="Nom" className="border p-2 w-full rounded"
                                       value={newStock.nom}
                                       onChange={(e) => setNewStock({ ...newStock, nom: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block font-medium">Description</label>
                                <input id="description" type="text" placeholder="Description" className="border p-2 w-full rounded"
                                       value={newStock.description}
                                       onChange={(e) => setNewStock({ ...newStock, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="quantite" className="block font-medium">Quantité</label>
                                <input
                                    id="quantite"
                                    type="number"
                                    placeholder="Quantité"
                                    className="border p-2 w-full rounded"
                                    value={newStock.quantiteDisponible || ""}
                                    onChange={(e) => setNewStock({
                                        ...newStock,
                                        quantiteDisponible: e.target.value === "" ? 0 : Number(e.target.value)
                                    })}
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block font-medium">Type</label>
                                <input id="type" type="text" placeholder="Type" className="border p-2 w-full rounded"
                                       value={newStock.type}
                                       onChange={(e) => setNewStock({ ...newStock, type: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="prix" className="block font-medium">Prix (€)</label>
                                <input
                                    id="prix"
                                    type="number"
                                    placeholder="Prix (€)"
                                    className="border p-2 w-full rounded"
                                    value={newStock.prix || ""}
                                    onChange={(e) => setNewStock({
                                        ...newStock,
                                        prix: e.target.value === "" ? 0 : Number(e.target.value)
                                    })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <button onClick={handleAddStock} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Ajouter
                            </button>
                            <button onClick={() => setShowAddPopup(false)} className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditStock;
