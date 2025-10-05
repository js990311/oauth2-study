import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

async function fetchMyInfo(accessToken: String){
    const target = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

    return await fetch(target, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export async function GET(req: NextRequest){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if(!accessToken){
        return NextResponse.json({error: 'Access token not found'}, {status: 401});
    }

    try {

        const resp = await fetchMyInfo(accessToken);

        if(!resp.ok){
            if(resp.status === 401){
                console.log("[/api/proxy/login] 토큰 만료 재발급 필요");
            }
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