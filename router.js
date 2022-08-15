/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
 function routes (fastify) {
    // const collection = fastify.mongo.db.collection('userCollection')

    fastify.get('/users', async (request, reply) => {
      const result = await collection.find().toArray()
      if (result.length === 0) {
        throw new Error('No documents found')
      }
      return result
    })

    fastify.get('/users/:user', async (request, reply) => {
      const result = await collection.findOne({ user: request.params.user })
      if (!result) {
        throw new Error('Invalid value')
      }
      return result
    })

    const userBodySchema = {
      type: 'object',
      required: ['user'],
      properties: {
        user: { type: 'object' },
      },
    }

    const schema = {
      body: userBodySchema,
      onRequest: [fastify.authenticate]
    }

    fastify.post('/users', { schema }, async (request, reply) => {
        console.log("Headers " + JSON.stringify(request.raw.headers))
      // we can use the `request.body` object to get the data sent by the client
      const result = await collection.insertOne({ user: request.body.user })
      return result
    })
}

export default routes