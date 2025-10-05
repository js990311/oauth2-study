import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import refreshAuthTokens from "@/utils/refreshToken";

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
        const fetchResp = await fetchMyInfo(accessToken);

        if(!fetchResp.ok){
            if(fetchResp.status === 401){
                console.log("[/api/proxy/login] 토큰 만료 재발급 필요");

                const refreshToken = cookieStore.get('refresh_token')?.value;
                if(!refreshToken){
                    return NextResponse.json({error: 'Refresh token not found'}, {status: 401});
                }

                const tokens = await refreshAuthTokens(refreshToken);

                console.log("토큰 재발급 완료");
                const fetchResp = await fetchMyInfo(tokens.access_token);
                console.log("토큰 재발급 이후 fetch", fetchResp.status);
                if(fetchResp.ok){
                    const resp = NextResponse.json(await fetchResp.json());

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
                }
            }
            return NextResponse.json({
                error: 'Failed to fetch'
            }, {status: 400});
        }

        const userinfo = await fetchResp.json();
        return NextResponse.json(userinfo);
    }catch (error){
        console.log(error);
        return NextResponse.json({error: 'SERVER ERROR'}, {status: 500});
    }
}