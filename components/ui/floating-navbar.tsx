"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export const FloatingNav = ({
                                navItems,
                                className,
                            }: {
    navItems: {
        name: string;
        link: string;
    }[];
    className?: string;
}) => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);
    const [isScrollable, setIsScrollable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ email: string; nom?: string } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const checkScrollable = () => {
            setIsScrollable(
                document.documentElement.scrollHeight > document.documentElement.clientHeight
            );
        };

        checkScrollable();
        window.addEventListener("resize", checkScrollable);
        return () => window.removeEventListener("resize", checkScrollable);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const supabase = createClient();

        const fetchUser = async () => {
            setIsLoading(true);
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                const { user } = data.session;
                const userId = user.id; 

                const { data: userData, error } = await supabase
                    .from("Utilisateur")
                    .select("nom")
                    .eq("id", userId)
                    .single();

                setUser(error ? { id: userId } : { id: userId, nom: userData.nom });
            } else {
                setUser(null);
            }

            setIsLoading(false);
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUser();
            } else {
                setUser(null);
            }
        });

        return () => {
            authListener.subscription?.unsubscribe();
        };
    }, [isMounted, router]);


    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (!isScrollable) {
            setVisible(true);
            return;
        }

        if (typeof current === "number") {
            const isAtTop = scrollYProgress.get() < 0.2;
            const previous = scrollYProgress.getPrevious();

            if (previous !== undefined) {
                const direction = current - previous;
                setVisible(isAtTop || direction < 0);
            }
        }
    });

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
    };

    if (!isMounted) return null;

    return (
        <motion.nav
            initial={{ opacity: 0, y: -100 }}
            animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
                className
            )}
        >
            <Link href="/">
                <Image src="/s.png" alt="Logo" width={40} height={40} className="object-contain" />
            </Link>
            {navItems.map((navItem, idx) => (
                <Link
                    key={`link-${idx}`}
                    href={navItem.link}
                    className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                >
                    <span className="hidden sm:block text-sm">{navItem.name}</span>
                </Link>
            ))}

            {isLoading ? (
                <span className="text-sm font-medium text-gray-500">Chargement...</span>
            ) : user ? (
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-black dark:text-white">
                        Bonjour, {user.nom ?? user.email}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="border text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
                    >
                        Déconnexion
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => router.push("/login")}
                    className="border text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
                >
                    Se connecter
                </button>
            )}
        </motion.nav>
    );
};
