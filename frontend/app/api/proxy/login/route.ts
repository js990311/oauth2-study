import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(request: NextRequest){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log("[/api/proxy/loigin] 시작");

    if(!accessToken){
        return NextResponse.json({error: 'Access token not found'}, {status: 401});
    }

    try {
        const target = "http://localhost:8080/api/login";

        const response = await fetch(target, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        const data = await response.json();
        console.log("[/api/proxy/loigin] 성공");
        return NextResponse.json(data, {status: response.status});
    }catch (error) {
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}