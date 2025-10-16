import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {withRetry} from "@/src/utils/refreshToken";

async function fetchSpring(accessToken: string){
    const target = "http://localhost:8080/api/login";

    return await fetch(target, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export async function GET(request: NextRequest){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if(!accessToken){
        return NextResponse.json({error: 'Access token not found'}, {status: 401});
    }

    try {
        const fetchResponse = await withRetry(accessToken, async (accessToken: string): Promise<Response>  => {
            return fetchSpring(accessToken);
        });
        const responseJson = await fetchResponse.json();
        return NextResponse.json(responseJson);
    }catch (error){
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}