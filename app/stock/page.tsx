'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import Image from 'next/image';
import useAuthUser from "@/lib/auth";

export default function Page() {
    const router = useRouter();
    const { user, isLoading } = useAuthUser();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && user) {
            console.log("Utilisateur récupéré :", user);
            const userRole = user.idRole === 1 ? "admin" : user.idRole === 2 ? "client" : null;
            setRole(userRole);
        }
    }, [user, isLoading]);

    const handleOrderClick = () => {
        router.push('/view-stock');
    };

    const handleGestionOrderClick = () => {
        router.push('/gestion-stock');
    };

    if (isLoading) {
        return <p className="text-center text-lg">Chargement...</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-zinc-800">
            <div className="flex flex-row gap-8">
                <BackgroundGradient className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
                    <Image
                        src={`/stock.jpg`}
                        alt="Voir la liste du stock"
                        height="400"
                        width="400"
                        className="rounded-[22px] object-contain mx-auto"
                    />
                    <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                        Liste du stock chez Anto&apos;Stock
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Ici, vous pourrez consulter en détail le stock d&apos;Anto&apos;Stock, avec toutes les informations nécessaires sur les articles disponibles.
                    </p>
                    <button
                        className="rounded-full pl-4 pr-4 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-gray-800 transition"
                        onClick={handleOrderClick}>
                        <span>Voir la liste</span>
                    </button>
                </BackgroundGradient>

                {role === 'admin' && (
                    <BackgroundGradient className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
                        <Image
                            src={`/stock2.jpg`}
                            alt="Gérer le stock"
                            height="400"
                            width="400"
                            className="rounded-[22px] object-contain mx-auto"
                        />
                        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                            Gérer votre liste de stock
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Ici, vous pouvez modifier, consulter en détail, ajouter ou supprimer un article de la liste selon vos besoins,
                            afin de gérer votre stock et d&apos;assurer un suivi optimal.
                        </p>
                        <button
                            className="rounded-full pl-4 pr-4 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-gray-800 transition"
                            onClick={handleGestionOrderClick}>
                            <span>Gérer le stock</span>
                        </button>
                    </BackgroundGradient>
                )}
            </div>
        </div>
    );
}
