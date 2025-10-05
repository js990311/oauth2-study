"use client"

import {useState} from "react";
import {LoginResponse} from "@/types/LoginResponse";

export default function RefreshPage() {
    const [message, setMessage] = useState("리프레시 진행 전");

    const refreshLogin = async () => {
        try {
            const resp = await fetch("/api/auth/refresh", {method: "POST"});
            const response: LoginResponse = await resp.json();
            setMessage(response.message);
        }catch (error){
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={() => {refreshLogin();}}>
                리프레시 하기
            </button>
            <p>
                {message}
            </p>
        </div>
    );
}