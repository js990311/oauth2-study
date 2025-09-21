"use client"

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [isFail, setIsFail] = useState<boolean>(false);

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
            <h3>
                로그인페이지
            </h3>
            <ul>
                <li>
                    <button onClick={() => onLogin()}>
                        KeyCloak 로그인
                    </button>
                </li>
            </ul>

        </div>
    )
}