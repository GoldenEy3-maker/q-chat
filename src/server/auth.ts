import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

// declare module "next-auth" {
// interface Session extends DefaultSession {
//   user: DefaultSession["user"] & {
//     id: string;
// ...other properties
// role: UserRole;
// };
// }

// interface User {
//   // ...other properties
//   // role: UserRole;
// }
// }

export const authOptions: NextAuthOptions = {
  callbacks: {
    // session: ({ session, user }) => ({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: user.id,
    //   },
    // }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", label: "Email" },
        password: { type: "password", label: "Пароль" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error("Неверный логин или пароль!");

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user?.password) throw new Error("Неверный логин или пароль!");

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) throw new Error("Неверный логин или пароль!");

        return user;
      },
    }),
  ],
  debug: env.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
