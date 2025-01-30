'use client'

import React from 'react'
import {useRouter} from "next/navigation";
import SignupFormDemo from "@/components/signup-form-demo";

export default function Page() {
    const router = useRouter();
    return(
        <>
            <SignupFormDemo/>
        </>
    )
}