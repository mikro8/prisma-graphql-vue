import { rule, shield, allow } from 'graphql-shield'
import { Context, DecodedToken } from './types/interface'
import { verify, sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'
import { User } from '.prisma/client'

export const SECRET = 'ssssssh123'

export function decodeTokenFromContext(
  context: Context,
): DecodedToken | undefined {
  // return  as DecodedToken
  const Authorization = context.req.cookies['Authorization']
  if (Authorization && Authorization.slice(0, 7) === 'Bearer ') {
    const token = Authorization.slice(7)
    const decoded = decodeToken(token)
    // console.
    return decoded
  }
  // return false
}

export function decodeToken(token: string): DecodedToken {
  // return  as DecodedToken
  return verify(token, SECRET) as DecodedToken
}

export function encodeToken(data: object): string {
  return sign(data, SECRET)
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function compareHash(user: User, inputPassword: string) {
  return compare(inputPassword, user.passwordHash)
}

export const Rules = {
  isLoggedIn: rule()(
    async (_parent, _args, context: Context): Promise<boolean> => {
      const decoded = decodeTokenFromContext(context)
      if (!decoded) {
        context.res.status(401) // set the 401 Unauthorized code
        return false
      }
      const user = await context.prisma.user.findFirst({
        where: {
          id: decoded?.id,
        },
      })
      // console.log(user)
      return user ? true : false
    },
  ),
}

export const permissions = shield(
  {
    Query: {
      listPersons: Rules.isLoggedIn,
      getMyUser: Rules.isLoggedIn,
      decodeMyToken: Rules.isLoggedIn,
    },
    // Mutation: {},
  },
  { allowExternalErrors: true }, // allow throwing custom errors with throw
)
