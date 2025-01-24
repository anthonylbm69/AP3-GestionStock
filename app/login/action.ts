'use server'

import {redirect} from "next/navigation";
import {error} from "next/dist/build/output/log";

export async function LoginAction (formData: FormData){
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    if (data.email === "admin@example.com" && data.password === "motdepassehash") {
        redirect("/")
    } else {
        redirect("/error")
        console.log(error())
    }
}
