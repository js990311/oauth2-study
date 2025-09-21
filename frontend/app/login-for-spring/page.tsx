"use client"

import {useState} from "react";

export default function LoginForSpringPage(){
    const [loading, setLoading] = useState<boolean>(false);
    const [isFail, setIsFail] = useState<boolean>(false);
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');

    const onLogin = async () => {
        const resp = await fetch('/api/proxy/login');
        const data = await resp.json();
        setToken(data.token);
        setLoading(false);
        if(!resp.ok){
            setIsFail(true);
        }else {
            setIsSucess(true);
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
                isFail && <div>실패</div>
            }
            {
                isSucess && <div>로그인 성공</div>
            }
            <div>
                <p>{token}</p>
            </div>
        </div>
    )
}