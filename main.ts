import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import { schema } from './api/schema'
import { Context } from './api/types/interface'
import { Request } from 'express'

const prisma = new PrismaClient()

const server = new ApolloServer({
  schema,
  context: (req): Context => {
    return {
      prisma,
      ...req
    }
  },
})

server.listen().then(info => {
    console.log(`SRV running on ${info.url}`)
})
