import { t } from 'i18next'

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
function publicRoutes (fastify, opts, done) {
    fastify.put('/some-route/:id', {
        schema: {
        description: t('home.title'),
        tags: ['user', 'code'],
        summary: 'qwerty',
        params: {
            type: 'object',
            properties: {
            id: {
                type: 'string',
                description: 'user id'
            }
            }
        },
        body: {
            type: 'object',
            properties: {
            hello: { type: 'string' },
            obj: {
                type: 'object',
                properties: {
                some: { type: 'string' }
                }
            }
            }
        },
        response: {
            201: {
            description: 'Successful response',
            type: 'object',
            properties: {
                hello: { type: 'string' }
            }
            },
            default: {
            description: 'Default response',
            type: 'object',
            properties: {
                foo: { type: 'string' }
            }
            }
        },
        security: [
            {
            "apiKey": []
            }
        ]
        }
    }, (req, reply) => {})

    done()
}

export default publicRoutes