import Fastify from 'fastify'
// import dbConnector from './database.js'
// import router from './router.js'
// import authentication from './authentication.js'
import swagger from '@fastify/swagger'
import privateRoutes from './routes/v1/private.js'
import publicRoutes from './routes/v1/public.js'
import { t } from 'i18next'
import i18next from 'i18next'
import middleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'
import fp from 'fastify-plugin'

i18next.use(Backend)
.use(middleware.LanguageDetector).init({
  debug: true,
  lng: 'en',
  fallbackLng: 'en',
  fallbackNS: 'translation',
  backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
  },
  ns: 'translation',
  defaultNS: 'translation',
  preload: ['en', 'de']
}, (err, t) => {
  if (err) return console.log('something went wrong loading', err);
  // t('home.title'); // -> same as i18next.t
})
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true
})

fastify.register(swagger, {
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'code', description: 'Code related end-points' }
    ],
    definitions: {
      User: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: {type: 'string', format: 'email' }
        }
      }
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
})

fastify.register(middleware.plugin, {
  i18next,
  ignoreRoutes: ['/foo'] // or function(req, res, options, i18next) { /* return true to ignore */ }
})

fastify.register(fp((fastify, opts, done) => {
  fastify.get('/i18n', {
    schema: {
    description: i18next.t('home.title'),
    tags: ['user', 'code'],
    summary: 'qwerty',
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
  }, (request, reply) => {
    var lng = request.language // 'de-CH'
    // var lngs = v.languages // ['de-CH', 'de', 'en']
    // request.i18n.changeLanguage('en') // will not load that!!! assert it was preloaded
  
    var exists = request.i18n.exists('home.title')
  
    // request.context.config.schema.description = request.t('home.title')
  
    var translation = request.t('home.title')
  
    console.log("Translation is ", translation)
  
    reply.send(translation)
  })

  done()
}))

await fastify.ready()

fastify.swagger()

const PORT = 3000

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: PORT })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()