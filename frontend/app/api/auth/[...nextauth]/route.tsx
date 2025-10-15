import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
            issuer: `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
        })
    ],
    callbacks : {
        async jwt({token, account}){
            console.log("jwt 콜백");
            if(account){
                console.log(account);
                console.log(token);
                token.idToken = account.id_token;
                token.accessToken = account.accessToken;
            }
            return token;
        },
        async session({session, token}){
            console.log("session 콜백");
            console.log(token);
            console.log(session);
            session.idToken = token.idToken;
            session.accessToken = token.accessToken;
            return session;
        }
    }
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};

