import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import  GoogleProvider  from 'next-auth/providers/google';

declare module "next-auth" {
    interface Session extends DefaultSession{
        user: {
            id: string;
        } & DefaultSession['user']
    }
}

declare module "next-auth/jwt" {
    interface JWT{
        id: string
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        jwt: async ({ token }) => {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token?.email
                }
            })
            if (dbUser) {
                token.id = dbUser.id
            }
            return token
        },
        session: ({session, token, user}) => {
            if(token){
                session.user.id = token.id
                session.user.email = token.email
                session.user.name = token.name
                session.user.image = token.picture
            }
            return session
        }
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ]
}

export const getAuthSession = () => {
    return getServerSession(authOptions)
}