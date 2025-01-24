'use client'
import React from 'react'
import {useRouter} from "next/navigation";

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
        </>
    )
}