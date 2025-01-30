'use client'
import React from 'react'
import {useRouter} from "next/navigation";
import LoginForm from "@/components/login-form";

export default function Page() {
    const router = useRouter();
    const handleSignup = () => {
        router.push('/signup')
    }
    return(
        <>
            <LoginForm/>
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 -mt-20 shadow-input bg-white dark:bg-black">
                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    onClick={handleSignup}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                        S'inscrire
                    </div>
                </button>
            </div>
        </>
    )
}