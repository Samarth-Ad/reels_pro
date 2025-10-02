import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import { Erica_One } from "next/font/google";
import { connectToDatabase } from "./db";
import User from "@/models/user";
import { error } from "console";
import bcrypt from "bcryptjs";


export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email : {label:"Email",type:"Text"},
                password : {label: "Password", type: "password"}
            },
            async authorize(credentials){

                if(!credentials?.email ||!credentials?.password){
                    throw new Error("Missing Email/Password")
                }

                try{
                    await connectToDatabase();
                    const user = await User.findOne({email : credentials.email});
                    if(!user){
                        throw new Error("No user Found");
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if(!isValid){
                        throw new Error("Password is in-valid");
                    }

                    return {
                        id : user._id.toString(),
                        email : user.email
                    }
                }
                catch{
                    throw error ;
                }

            }
        })
    ],

    // callbacks 
    callbacks : {
        async jwt({token,user}){
            if(user){
                token.id = user.id ;
            }
            return token ;
        },
        async session({session,token}){

            if(session.user){
                session.user.id = token.id as string ;
            }

            return session;
        }
    },

    pages : {
        signIn: "/login",
        error: "/login"
    },

    session : {
        strategy: "jwt",
        maxAge : 30 * 24 * 60 * 60
    },

    secret : process.env.NEXTAUTH_SECRET
}