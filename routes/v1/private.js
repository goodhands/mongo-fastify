import { t } from 'i18next'
import i18next from 'i18next'
import middleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
function privateRoutes (fastify, opts, done) {
    i18next
        .use(Backend)
        .use(middleware.LanguageDetector).init({
            debug: true,
            lng: 'en',
            fallbackLng: 'en',
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json',
            },
            ns: 'translation',
            defaultNS: 'translation',
            preload: ['en', 'de']
        }, (err, t) => {
        if (err) return console.log('something went wrong loading', err);
        t('home.title'); // -> same as i18next.t
    })

    fastify.register(middleware.plugin, {
        i18next,
        ignoreRoutes: ['/foo'] // or function(req, res, options, i18next) { /* return true to ignore */ }
    })

    i18next.on('initialized', function() {
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
            description: t('home.title'),
          }
      
          fastify.post('/users', {
              body: userBodySchema,
              description: request.t('home.title')
          }, async (request, reply) => {
              console.log("Headers " + JSON.stringify(request.raw.headers))
            // we can use the `request.body` object to get the data sent by the client
            const result = await collection.insertOne({ user: request.body.user })
            return result
          })
      
    })

    done()
}

export default privateRoutes