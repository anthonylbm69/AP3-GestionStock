'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/utils/supabase/supabaseClient';
import { FaEye, FaEdit } from "react-icons/fa";
type Commande = {
    id: number;
    client: string;
    montant: string;
    statut: string;
};


export default function Page() {
    const router = useRouter();
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCommandes = async () => {
            const { data, error } = await supabase
                .from('Commande')
                .select(`
                    id,
                    statut,
                    utilisateur:Utilisateur ( nom, prenom ),
                    detailsCommande:DetailsCommande ( quantite, stock:Stock ( prix ) )
                `);

            if (error) {
                console.error('Erreur lors de la récupération des commandes :', error);
            } else {
                const commandesAvecMontant = data.map(commande => {
                    const montantTotal = commande.detailsCommande.reduce((total, detail) => {
                        return total + detail.quantite * detail.stock.prix;
                    }, 0);

                    return {
                        id: commande.id,
                        client: `${commande.utilisateur.nom} ${commande.utilisateur.prenom}`,
                        montant: montantTotal.toFixed(2),
                        statut: commande.statut
                    };
                });

                setCommandes(commandesAvecMontant);
            }
        };

        fetchCommandes();
    }, []);

    const openModal = (commande: any) => {
        setSelectedCommande(commande);
        setNewStatus(commande.statut);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCommande(null);
    };

    const updateCommandeStatus = async () => {
        if (!selectedCommande) return;

        const { error } = await supabase
            .from('Commande')
            .update({ statut: newStatus })
            .eq('id', selectedCommande.id);

        if (error) {
            console.error('Erreur lors de la mise à jour du statut :', error);
        } else {
            setCommandes(commandes.map(cmd =>
                cmd.id === selectedCommande.id ? { ...cmd, statut: newStatus } : cmd
            ));
            closeModal();
        }
    };

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4 mt-10">Gérer les commandes</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <Table className="border border-gray-200">
                        <TableHeader>
                            <TableRow>
                                <TableHead>N°Commande</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Montant (€)</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commandes.map((commande) => (
                                <TableRow key={commande.id}>
                                    <TableCell>{commande.id}</TableCell>
                                    <TableCell>{commande.client}</TableCell>
                                    <TableCell>{commande.montant} €</TableCell>
                                    <TableCell>{commande.statut}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <button onClick={() => router.push(`/gestion-order/${commande.id}`)}
                                                className="text-green-500 hover:text-green-700">
                                            <FaEye size={20} />
                                        </button>
                                        <button onClick={() => openModal(commande)}
                                                className="text-blue-500 hover:text-blue-700">
                                            <FaEdit size={20} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Modifier le statut</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        >
                            <option value="En attente">En attente</option>
                            <option value="Validée">valide</option>
                            <option value="Refusée">invalide</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                            <button onClick={updateCommandeStatus} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
