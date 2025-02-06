import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'USER' | 'SELLER' | 'ADMIN';
      image?: string | null;
    };
    accessToken: string;
    refreshToken?: string | null;

  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'SELLER' | 'ADMIN';
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface Jwt {
    userId: string;
    role: 'USER' | 'SELLER' | 'ADMIN';
    accessToken: string;
    refreshToken?: string;
  }
}