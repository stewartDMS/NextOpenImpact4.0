import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      accountType?: string
    }
  }

  interface User {
    accountType?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accountType?: string
  }
}