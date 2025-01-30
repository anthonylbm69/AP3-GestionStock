'use client'
import React, {useEffect, useState} from 'react'
import {useRouter} from "next/navigation";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default function Page() {
    const router = useRouter();


    return(
        <>
            <p>
                page gestion-order
            </p>

            <button
                onClick={() => router.push("/validate-state")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                En attente
            </button>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 mt-10">Récapitulatif de la commande</h1>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <Table className="border border-gray-200">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N°Commande</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}