'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/utils/supabase/supabaseClient";
import { FaEye, FaEdit } from "react-icons/fa";
import useAuthUser from "@/lib/auth";

type DetailCommande = {
    produit: string;
    quantite: number;
};

type Commande = {
    id: number;
    client: string;
    montant: string;
    statut: string;
    details?: DetailCommande[];
};

type SupabaseStock = {
    nom: string;
    prix: number;
    quantiteDisponible: number;
};

type SupabaseDetailCommande = {
    quantite: number;
    Stock: SupabaseStock;
};

type SupabaseUtilisateur = {
    nom: string;
    prenom: string;
};

type SupabaseCommande = {
    id: number;
    statut: string;
    Utilisateur: SupabaseUtilisateur[];
    DetailsCommande: SupabaseDetailCommande[];
};

export default function Page() {
    const router = useRouter();
    const { user, isLoading } = useAuthUser();
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            if (user.idRole !== 1) {
                router.push("/error");
            } else {
                fetchCommandes();
            }
        }
    }, [user, isLoading, router]);


    const fetchCommandes = async () => {
        const { data, error } = await supabase
            .from("Commande")
            .select(`
      id,
      statut,
      Utilisateur (
        nom,
        prenom
      ),
      DetailsCommande (
        quantite,
        Stock (
          nom,
          prix,
          quantiteDisponible
        )
      )
    `);

        if (error) {
            console.error("Erreur lors de la récupération des commandes :", error);
            return;
        }

        if (!data) return;

        const commandesAvecMontant: Commande[] = (data as unknown as SupabaseCommande[]).map((commande) => {
            const montantTotal = commande.DetailsCommande?.reduce((total, detail) => {
                return total + (detail.quantite * (detail.Stock?.prix || 0));
            }, 0) || 0;

            return {
                id: commande.id,
                client: `${commande.Utilisateur[0]?.nom || ''} ${commande.Utilisateur[0]?.prenom || ''}`,
                montant: montantTotal.toFixed(2),
                statut: commande.statut,
                details: commande.DetailsCommande?.map((detail) => ({
                    produit: detail.Stock?.nom || '',
                    quantite: detail.quantite
                }))
            };
        });

        setCommandes(commandesAvecMontant);
    };


    const openDetailsModal = (commande: Commande) => {
        setSelectedCommande(commande);
        setIsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsModalOpen(false);
        setSelectedCommande(null);
    };

    const openEditModal = (commande: Commande) => {
        setSelectedCommande(commande);
        setNewStatus(commande.statut);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCommande(null);
    };

    const updateCommandeStatus = async () => {
        if (!selectedCommande) return;

        const { error } = await supabase
            .from("Commande")
            .update({ statut: newStatus })
            .eq("id", selectedCommande.id);

        if (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
        } else {
            setCommandes(commandes.map((cmd) =>
                cmd.id === selectedCommande.id ? { ...cmd, statut: newStatus } : cmd
            ));
            closeEditModal();
        }
    };

    if (isLoading) {
        return <p className="text-center text-lg">Chargement...</p>;
    }

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
                                        <button
                                            onClick={() => openDetailsModal(commande)}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <FaEye size={20} />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(commande)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {isModalOpen && selectedCommande && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Détails de la Commande</h2>
                        <p className="font-medium">Client : {selectedCommande.client}</p>
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Produits commandés :</h3>
                            <ul className="list-disc pl-5">
                                {selectedCommande.details?.map((detail, index) => (
                                    <li key={index}>
                                        {detail.produit} - Quantité: {detail.quantite}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeDetailsModal} className="px-4 py-2 bg-gray-300 rounded">Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedCommande && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Modifier le Statut de la Commande</h2>
                        <div className="mt-4">
                            <label htmlFor="status" className="block font-medium">Statut</label>
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full p-2 border rounded mb-4"
                            >
                                <option value="en_attente">En attente</option>
                                <option value="valide">Validée</option>
                                <option value="invalide">Refusée</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeEditModal} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
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
