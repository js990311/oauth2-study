import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";



export async function POST(req: NextRequest){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if(!refreshToken){
        return NextResponse.json({error: 'Refresh token not found'}, {status: 401});
    }

    try {
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

        const tokens = await response.json();

        console.log(tokens);

        if(!response.ok){
            return NextResponse.json({
                error: 'Failed to fetch'
            }, {status: 400});
        }

        const redirectUrl = new URL('/', req.nextUrl.origin);
        const resp = NextResponse.redirect(redirectUrl);

        // access 토큰 저장
        resp.cookies.set('access_token', tokens.access_token, {
            httpOnly: true,
            path: '/'
        });

        // refresh 토큰 저장
        resp.cookies.set('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            path: '/'
        });

        return resp;
    }catch (error){
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}