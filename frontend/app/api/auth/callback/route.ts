import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    console.log(`[callback] searchParams : ${searchParams}`);

    const code = searchParams.get('code');
    console.log(`[callback] code : ${code}`);

    if (!code) {
        return NextResponse.json({
            error: 'CODE NOT FOUND',
        },{
            status: 400,
        });
    }

    try {
        const target = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`;
        const response = await fetch(target, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
            }),
        });
        const tokens = await response.json();

        if(!response.ok) {
            console.error("Failed to fetch token", tokens);
            throw new Error(`Failed to fetch token: ${tokens}`);
        }

        const redirectUrl = new URL('/', request.nextUrl.origin);
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

        console.log(tokens);

        return resp;
    }catch (error) {
        console.error(error);
        return NextResponse.json({
            error: 'CODE NOT FOUND',
        },{
            status: 400,
        });
    }
}