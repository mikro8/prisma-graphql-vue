import { PrismaClient, User } from '@prisma/client'
import { Request } from 'express'

export interface Context {
  prisma: PrismaClient
  req: Request
}

export interface DecodedToken extends User {
  iat: number
}
