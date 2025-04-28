'use client'
import React from 'react'
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from 'react-icons/fa';
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter();

    const handleBackHome = () => {
      router.push('/')
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-zinc-900">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto text-center">
                <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    Merci pour votre commande !
                </h1>
                <p className="text-lg text-gray-600 dark:text-neutral-300 mb-6">
                    Votre commande a bien été passée. Vous recevrez une confirmation par e-mail sous peu.
                    Notre équipe s&apos;occupe de la préparation et de l&apos;expédition.
                </p>
                <Button
                    className="w-full bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 transition-all"
                    onClick={handleBackHome}
                >
                    Retour à l&apos;accueil
                </Button>
            </div>
        </div>
    )
}
