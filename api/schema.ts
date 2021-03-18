import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { GraphQLDateTime } from 'graphql-iso-date'
import { Context } from './types/interface'
import {
  permissions,
  hashPassword,
  compareHash,
  encodeToken,
  decodeTokenFromContext,
} from './auth'
import { applyMiddleware } from 'graphql-middleware'
// import { Prisma } from '@prisma/client'

export const DateTime = asNexusMethod(GraphQLDateTime, 'date')

const Queries = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('listPersons', {
      type: 'Person',
      resolve: (parent, args, context: Context) => {
        return context.prisma.person.findMany()
      },
    })

    t.nullable.field('getMyUser', {
      type: 'User',
      resolve: async (parent, args, context: Context) => {
        const decodedId = decodeTokenFromContext(context)?.id
        if (decodedId) {
          const user = context.prisma.user.findFirst({
            where: {
              id: decodedId,
            },
          })

          return user
        }
        return null
      },
    })

    t.nullable.field('decodeMyToken', {
      type: 'DecodedToken',
      resolve: async (parent, args, context: Context) => {
        const decoded = decodeTokenFromContext(context)
        if (decoded) return decoded
        return null
      },
    })
  },
})

const Mutations = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signin', {
      type: 'AuthType',
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (parent, { username, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: { username: username },
        })
        if (!user) throw new Error('invalid username or password')

        const passwordMatched = compareHash(user, password)
        if (!passwordMatched) throw new Error('invalid username or password')

        return {
          token: encodeToken(user),
          user: user,
        }
      },
    })

    t.field('signup', {
      type: 'AuthType',
      args: {
        personId: nonNull(intArg()),
        username: nonNull(stringArg()),
        password_1: nonNull(stringArg()),
        password_2: nonNull(stringArg()),
      },
      resolve: async (
        parent,
        { personId, username, password_1, password_2 },
        context: Context,
      ) => {
        if (password_1 !== password_2) throw new Error("passwords don't match")
        let user = await context.prisma.user.findFirst({
          where: {
            OR: [{ username }, { personId }],
          },
        })

        // console.log(user)

        if (user)
          throw new Error('username already exists or person has account')

        user = await context.prisma.user.create({
          data: {
            username,
            personId,
            passwordHash: await hashPassword(password_1),
          },
        })

        return {
          token: encodeToken(user),
          user: user,
        }
      },
    })
  },
})

const Person = objectType({
  name: 'Person',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('firstname')
    t.nonNull.string('lastname')
    t.field('fullname', {
      type: 'String',
      resolve: (parent) => {
        return `${parent.firstname} ${parent.lastname}`
      }
    })
    t.nonNull.date('employmentDate')
    t.nonNull.boolean('employmentStatus')
    t.date('unEmploymentDate')
    t.nonNull.float('salary')
    t.string('email')
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('username')
    t.nonNull.boolean('isAdmin')
    // t.nonNull.string('passwordHash')
    t.field('person', {
      type: 'Person',
      resolve: (parent, args, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .person()
      },
    })
  },
})

const AuthType = objectType({
  name: 'AuthType',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

const DecodedTokenType = objectType({
  name: 'DecodedToken',
  definition(t) {
    t.int('id')
    t.string('username')
    t.string('passwordHash')
    t.int('personId')
    t.boolean('isAdmin')
    t.int('iat')
  }
})

const MainSchema = makeSchema({
  types: [
    Queries,
    Mutations,
    User,
    Person,
    DateTime,
    AuthType,
    DecodedTokenType,
  ],
  outputs: {
    schema: __dirname + '/schema.graphql',
    typegen: __dirname + '/types/nexus.ts',
  },
  contextType: {
    module: require.resolve('./types/interface'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

// export const schema = MainSchema

export const schema = applyMiddleware(MainSchema, permissions)
