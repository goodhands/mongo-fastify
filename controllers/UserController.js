import fp from "fastify-plugin"

export default fp(async function(fastify, opts) {
    const schema = {
        body: userBodySchema,
        onRequest: [fastify.authenticate]
    }
    const collection = fastify.mongo.db.collection('userCollection')
    const userBodySchema = {
        type: 'object',
        required: ['user'],
        properties: {
            user: { type: 'object' },
        },
    }

    const UserController = {
        allUsers: async (request, reply) => {
            const result = await collection.find().toArray()
            if (result.length === 0) {
                throw new Error('No documents found')
            }
            return result
        },
        findUser: async(request, reply) => {
            const result = await collection.findOne({ user: request.params.user })
            if (!result) {
                throw new Error('Invalid value')
            }
            return result
        },
        createUser: async(request, reply) => {
            console.log("Headers " + JSON.stringify(request.raw.headers))
            // we can use the `request.body` object to get the data sent by the client
            const result = await collection.insertOne({ user: request.body.user })
            return result
        }
    }
})

// export default UserController
