import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {LoginResponse} from "@/src/types/LoginResponse";
import refreshAuthTokens from "@/src/utils/refreshToken";



export async function POST(req: NextRequest): Promise<NextResponse<LoginResponse>>{
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if(!refreshToken){
        return NextResponse.json({
            code: 44,
            message: 'refresh token not found',
        }, {status: 401});
    }

    try {
        const tokens = await refreshAuthTokens(refreshToken);

        const resp = NextResponse.json({
            code: 20,
            message: 'token refresh success',
        }, {status: 200});

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
        return NextResponse.json({
            code: 50,
            message: 'unknown error occurred',
        }, {status: 500});
    }
}