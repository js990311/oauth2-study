"use client"

import {SessionProvider} from "next-auth/react";
import {getServerSession} from "next-auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}