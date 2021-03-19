// import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import { schema } from './api/schema'
// import { Context } from './api/types/interface'
import { Request, Response } from 'express'
import express from 'express'
import cookieParser from 'cookie-parser'
const { graphqlHTTP } = require('express-graphql');

const prisma = new PrismaClient()
const app = express()
app.use(cookieParser())

app.use(
  '/graphql',
  graphqlHTTP(async (req: Request, res: Response) => {
      return {
        schema: schema,
        context: { prisma, ...req, ...res },
        graphiql: true,
      }
  }),
)

app.listen(4000, () => {
    console.log(`SRV running on http://localhost:4000/graphql`)
})
