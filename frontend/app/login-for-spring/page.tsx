"use client"

import {useState} from "react";
import {LoginResponse} from "@/types/LoginResponse";

export default function LoginForSpringPage(){
    const [loading, setLoading] = useState<boolean>(false);
    const [isFail, setIsFail] = useState<boolean>(false);
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [message, setMessage] = useState<string>('');

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
    
    return (
        <div>
            <button onClick={()=>{
                onLogin();
            }}>
                로그인하기
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