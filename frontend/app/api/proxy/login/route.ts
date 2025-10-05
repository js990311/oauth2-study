import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {LoginResponse} from "@/types/LoginResponse";

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

    console.log("[/api/proxy/loigin] 시작");

    if(!accessToken){
        return NextResponse.json({error: 'Access token not found'}, {status: 401});
    }

    try {
        const response = await fetchSpring(accessToken);
        const data: LoginResponse = await response.json();

        if(response.status !== 200){
            if(data.code == 42){
                console.log("[/api/proxy/login] 토큰 만료 재발급 필요");
            }
        }

        return NextResponse.json(data, {status: response.status});
    }catch (error) {
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}