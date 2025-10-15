"use client"

import {useState} from "react";
import {LoginResponse} from "@/types/LoginResponse";
import {useSession} from "next-auth/react";
import {session} from "next-auth/core/routes";

export default function LoginForSpringPage(){
    const [loading, setLoading] = useState<boolean>(false);
    const [isFail, setIsFail] = useState<boolean>(false);
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const {data: session} = useSession();

    const onLogin = async () => {
        const resp = await fetch('/api/proxy/login');
        const data: LoginResponse = await resp.json();

        console.log(data);
        setMessage(data.message);
        if(data.code === 20){
            setIsSucess(true);
            setMessage("로그인 성공");
        }else {
            setIsFail(true);
            if(data.code === 42){
                console.log("토큰 REFRESH 필요");
            }
        }
    };

    const onLoginUseNextAuth = async () => {
        if(!session || !session.idToken){
            if(!session){
                console.log("로그인 필요");
            }else{
                console.log("idToken 없음");
            }
            
            setIsFail(true);
            return;
        }

        try {
            const target = "http://localhost:8080/api/login";
            const response = await fetch(target, {
                headers: {
                    Authorization: `Bearer ${session.idToken}`,
                }
            });
            if(response.ok){
                setIsSucess(true);
                setMessage("로그인 성공");
            }else {
                setIsFail(true);
                setMessage("로그인 실패");
            }
        }catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div>
            <button onClick={()=>{
                onLogin();
            }}>
                로그인하기
            </button>
            <button onClick={() => {
                onLoginUseNextAuth();
            }}>
                next-auth로 로그인하기
            </button>
            {loading && <div>
                로딩중
            </div>}
            {
                isFail && <div>{message}</div>
            }
            {
                isSucess && <div>{message}</div>
            }
            <div>
                <p>{token}</p>
            </div>
        </div>
    )
}