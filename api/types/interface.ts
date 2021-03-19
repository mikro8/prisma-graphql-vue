import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
}

export interface DecodedToken extends User {
  iat: number
}
