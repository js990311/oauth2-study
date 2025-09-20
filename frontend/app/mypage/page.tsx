"use client"

import {useEffect, useState} from "react";

export default function MyPage(){
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [loading, setLoading] = useState<boolean>(true);
    const [isFail, setIsFail] = useState<boolean>(false);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const resp = await fetch("/api/auth/my-info");
                if(!resp.ok){
                    throw new Error("로그인 실패");
                }
                const data : UserInfo = await resp.json();
                setUserInfo(data);
            }catch (error){
                console.error(error);
                setIsFail(true);
            }finally {
                setLoading(false);
            }
        }
        getUserInfo();
    }, []);
    
    if(loading){
        return (
            <div>로딩중</div>
        );
    }

    if(isFail){
        return (
            <div>로그인 실패 </div>
        );
    }

    return (
        <div>
            <div>
                <p>
                      sub
                </p>
                <p>
                    {userInfo?.sub}
                </p>
            </div>
            <div>
                <p>
                    name
                </p>
                <p>
                    {userInfo?.name}
                </p>
            </div>
            <div>
                <p>
                    preferred_username
                </p>
                <p>
                    {userInfo?.preferred_username}
                </p>
            </div>
            <div>
                <p>
                    email
                </p>
                <p>
                    {userInfo?.email}
                </p>
            </div>
        </div>
    );
}