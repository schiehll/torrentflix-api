import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { makeExecutableSchema } from 'apollo-server-express'
import { graphqlExpress } from 'apollo-server-express/dist/expressApollo'
import expressPlayground from 'graphql-playground-middleware-express'
import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'

const app = express()
const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
})

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  graphqlExpress(req => ({
    schema: executableSchema
  }))
)

app.get('/playground', expressPlayground({ endpoint: '/graphql' }), () => {})

export default app
