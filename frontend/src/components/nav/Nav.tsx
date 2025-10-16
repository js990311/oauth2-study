import Link from "next/link";
import NavLoginButton from "@/src/components/nav/NavLoginButton";

export default function Nav(){

    return (
        <nav className={"flex items-center justify-between px-2 py-2 bg-black text-white"}>
            <div>
                <Link href={"/"}>
                    메인페이지
                </Link>
            </div>
            <div>
                <NavLoginButton></NavLoginButton>
            </div>
        </nav>
    )
}