import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(req: NextRequest){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if(!accessToken){
        return NextResponse.json({error: 'Access token not found'}, {status: 401});
    }

    try {
        const target = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

        const resp = await fetch(target, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if(!resp.ok){
            return NextResponse.json({
                error: 'Failed to fetch'
            }, {status: 400});
        }

        const userinfo = await resp.json();
        return NextResponse.json(userinfo);
    }catch (error){
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}