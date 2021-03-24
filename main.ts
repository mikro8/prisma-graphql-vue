// import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import { schema } from './api/schema'
// import { Context } from './api/types/interface'
// import { Request, Response } from 'express'
import express from 'express'
import cookieParser from 'cookie-parser'
import { graphqlHTTP } from 'express-graphql'
import path from 'path'

declare const NODE_ENV: string

const prisma = new PrismaClient()

const app = express()

console.log(__dirname)

app.use(cookieParser())

app.use(
  '/graphql',
  graphqlHTTP(async (req, res) => {
    return {
      schema: schema,
      context: { prisma, ...req, ...res },
      graphiql: true,
    }
  }),
)

if (process.argv.includes('--development') === false) {
  const history = require('connect-history-api-fallback')
  const staticFileMiddleware = express.static(
    path.join(__dirname, 'public'),
  )
  app.use(history())
  app.use(staticFileMiddleware)
} else {
  const { createProxyMiddleware } = require('http-proxy-middleware')
  app.use(
    '*',
    createProxyMiddleware({
      target: 'http://localhost:4001',
      changeOrigin: true,
    }),
  )
}



app.listen(4000, () => {
  console.log(`SRV running on http://localhost:4000/graphql`)
})
