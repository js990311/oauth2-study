import {NextResponse} from "next/server";
import {cookies} from "next/headers";

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

export async function withRetry(accessToken: string, f : (accessToken: string) => Promise<Response>){
    try {
        console.log("[withRetry] withRetry");
        const fetchResponse = await f(accessToken);
        if(fetchResponse.status === 401){
            // 토큰 재발급
            console.log("[withRetry] 토큰 재발급");
            const cookieStore = cookies();
            const refreshToken = cookieStore.get("refresh_token")?.value;

            if(!refreshToken){
                throw new Error("refresh token not found");
            }

            console.log("[withRetry] 토큰 재발급 성공");

            const tokens: tokens = await refreshAuthTokens(refreshToken);
            const retryResponse = await f(tokens.access_token);
            if(retryResponse.ok){
                console.log("[withRetry] 재시도 성공");

                cookies().set('access_token', tokens.access_token, {httpOnly: true});
                cookies().set('refresh_token', tokens.refresh_token, {httpOnly: true});
                return retryResponse;
            }else {
                return fetchResponse;
            }
        }else {
            return fetchResponse;
        }
    }catch (error){
        console.log("[withRetry]",error);
        throw error;
    }
}