'use client'
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase/supabaseClient";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

type Stock = {
    id: number;
    nom: string;
    description: string;
    quantiteDisponible: number;
    type: string;
    prix: number;
};

const ViewStock = () => {
    const [stock, setStock] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

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
                        <TableHead>Quantite Disponible</TableHead>
                        <TableHead>Prix(en €)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stock.map((stocks) => (
                        <TableRow key={stocks.id}>
                            <TableCell>{stocks.nom}</TableCell>
                            <TableCell>{stocks.description}</TableCell>
                            <TableCell>{stocks.quantiteDisponible}</TableCell>
                            <TableCell>{stocks.prix} €</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ViewStock;
