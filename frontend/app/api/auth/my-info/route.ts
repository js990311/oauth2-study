import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import refreshAuthTokens, {withRetry} from "@/src/utils/refreshToken";

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
        const fetchResponse = await withRetry(accessToken, async (accessToken: string): Promise<Response>  => {
            return fetchMyInfo(accessToken);
        });
        const responseJson = await fetchResponse.json();
        return NextResponse.json(responseJson);
    }catch (error){
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}