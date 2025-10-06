import "next-auth";

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    encryptionSalt: string;
  }

  interface Session {
    user?: {
      id: string;

      encryptionSalt: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;

    encryptionSalt: string;
  }
}
