import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return NextResponse.json({ user: decoded }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }
}
