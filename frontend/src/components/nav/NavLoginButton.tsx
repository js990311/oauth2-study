"use client"

import {signIn, signOut, useSession} from "next-auth/react";

export default function NavLoginButton() {
    const {data: session, status} = useSession();

    if(status === "authenticated"){
        return (
            <div>
                <button onClick={() => signOut()}>
                    로그아웃하기
                </button>
            </div>
        )
    }else {
        return (
            <div>
                <button onClick={() => signIn('keycloak')}>
                    로그인하기
                </button>
            </div>
        )
    }
}