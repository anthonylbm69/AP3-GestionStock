'use client'
import React, { useEffect } from 'react';
import useAuthUser from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { user, isLoading } = useAuthUser();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.idRole !== 1) {
                router.push("/error");
            }
        }
    }, [user, isLoading]);

    return (
        <>
            <p>PPPP</p>
        </>
    );
}
