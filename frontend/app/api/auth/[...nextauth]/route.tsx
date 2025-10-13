import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
        })
    ],
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};

