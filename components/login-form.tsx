"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoginAction } from "@/app/login/action";

export default function LoginForm() {
  return (
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl mt-20 p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Bienvenue sur Anto'Gestion
        </h2>
        <form className="my-8" action={LoginAction}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" required />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Mot de Passe</Label>
            <Input id="password" name="password" placeholder="••••••••" type="password" required />
          </LabelInputContainer>
            <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                formAction={LoginAction}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                    Se connecter &rarr;
                </div>
            </button>
        </form>
      </div>
  );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-black to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-black to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
    }: {
    children: React.ReactNode;
    className?: string;
    }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
