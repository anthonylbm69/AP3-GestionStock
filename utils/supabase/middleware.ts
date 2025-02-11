import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next();

    const token = request.cookies.get('token')?.value;
    console.log("Token récupéré:", token);

    if (token) {
        try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!verifyResponse.ok) {
                throw new Error('Token invalide');
            }

            const { user } = await verifyResponse.json();
            console.log("Token valide, utilisateur :", user);
        } catch (error) {
            console.error("❌ Erreur de validation du token:", error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    const { pathname } = request.nextUrl;

    // Autoriser l'accès aux pages login et signup
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
        console.log("Accès autorisé aux pages publiques");
        return response;
    }

    console.log("✅ Utilisateur connecté, accès autorisé");
    return response;
}

export const config = {
    runtime: "nodejs", // Obligatoire pour le middleware Node.js
};
