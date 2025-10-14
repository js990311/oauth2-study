"use client"

import {SessionProvider} from "next-auth/react";
import {getServerSession} from "next-auth";

export default async function AuthProvider({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}