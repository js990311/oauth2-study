"use client"

import {useRouter} from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    const onLogin = () => {
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
            response_type: 'code',
            scope: 'openid email'
        });

        const target = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/auth?${params.toString()}`;
        console.log(target);
        router.push(target);
    }

    return (
        <div>
            로그인페이지
            <button onClick={()=>onLogin()}>
                KeyCloak 로그인
            </button>
        </div>
    )
}