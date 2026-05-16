import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/repositories/users.repository";
import { comparePassword } from "@/lib/passwords";
import {
  getClientIp,
  isLoginRateLimited,
  recordLoginAttempt,
} from "@/lib/apiSecurity";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const ip = getClientIp(request);

        if (!email || !password) {
          return null;
        }

        if (isLoginRateLimited(email, ip)) {
          return null;
        }

        const user = await findUserByEmail(email);

        if (!user || !user.is_active) {
          recordLoginAttempt(email, ip, false);
          return null;
        }

        const passwordOk = await comparePassword(password, user.password_hash);

        if (!passwordOk) {
          recordLoginAttempt(email, ip, false);
          return null;
        }

        recordLoginAttempt(email, ip, true);

        return {
          id: String(user.id_user),
          id_user: user.id_user,
          id_customer: user.id_customer,
          email: user.email,
          name: user.full_name,
          full_name: user.full_name,
          role_code: user.role_code,
          role_name: user.role_name,
          customer_name: user.customer_name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id_user = user.id_user;
        token.id_customer = user.id_customer;
        token.full_name = user.full_name;
        token.role_code = user.role_code;
        token.role_name = user.role_name;
        token.customer_name = user.customer_name;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id_user = token.id_user;
      session.user.id_customer = token.id_customer;
      session.user.full_name = token.full_name || session.user.name;
      session.user.role_code = token.role_code;
      session.user.role_name = token.role_name;
      session.user.customer_name = token.customer_name;

      return session;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}
