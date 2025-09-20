import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <div>
        메인페이지
          <ul>
              <li>
                <Link href={"/login"}>
                    로그인하러 가기
                </Link>
              </li>
              <li>
                  <Link href={"/mypage"}>마이페이지 가기</Link>
              </li>
          </ul>
      </div>
  );
}
