import {NextResponse} from "next/server";

export default async function refreshAuthTokens (refreshToken: string): tokens{
    const target = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const response = await fetch(target, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
            refresh_token: refreshToken,
        })
    });

    if(!response.ok){
        throw new Error("failed to refresh token");
    }

    const tokens = await response.json();
    return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
    };
}