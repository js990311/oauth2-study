"use client"

export default function RefreshPage() {

    const refreshLogin = async () => {
        try {
            const resp = await fetch("/api/auth/refresh", {method: "POST"});
            if(!resp.ok){
                throw new Error("로그인 실패");
            }
        }catch (error){
            console.error(error);
        }
    }


    return (
        <div>
            <button onClick={() => {refreshLogin();}}>
                리프레시 하기
            </button>
        </div>
    );
}