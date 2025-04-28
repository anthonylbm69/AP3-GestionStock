'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import Image from 'next/image';
import useAuthUser from '@/lib/auth';

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
        router.push('/place-an-order');
    };

    const handleGestionOrderClick = () => {
        router.push('/gestion-order');
    };

    if (isLoading) {
        return <p className="text-center text-lg">Chargement...</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-zinc-800">
            <div className="flex flex-row gap-8">
                <BackgroundGradient className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
                    <Image
                        src={`/4767994.jpg`}
                        alt="pass an order"
                        height="400"
                        width="400"
                        className="rounded-[22px] object-contain mx-auto"
                    />
                    <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                        Passe une commande chez Anto&apos;Stock
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Anto&apos;Stock, votre plateforme pour commander facilement des matériaux et des médicaments.
                        Profitez d&apos;une livraison rapide sous 7 jours en France métropolitaine.
                    </p>
                    <button
                        className="rounded-full pl-4 pr-4 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-gray-800 transition"
                        onClick={handleOrderClick}>
                        <span>Passer une commande</span>
                    </button>
                </BackgroundGradient>

                {role === 'admin' && (
                    <BackgroundGradient className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
                        <Image
                            src={`/gestion-order-image.jpg`}
                            alt="Gérer les commandes"
                            height="400"
                            width="400"
                            className="rounded-[22px] object-contain mx-auto"
                        />
                        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                            Gérer les commandes
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Anto&apos;Stock, votre plateforme pour commander facilement des matériaux et des médicaments.
                            Profitez d&apos;une livraison rapide sous 7 jours en France métropolitaine.
                        </p>
                        <button
                            className="rounded-full pl-4 pr-4 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-gray-800 transition"
                            onClick={handleGestionOrderClick}>
                            <span>Gérer une commande</span>
                        </button>
                    </BackgroundGradient>
                )}
            </div>
        </div>
    );
}
