import fp from "fastify-plugin"
import jwt from "@fastify/jwt"
import auth from "@fastify/auth"
import { readFileSync } from 'fs'
// import routes from './router.js'
// import router from './router.js'


export default fp(async function(fastify, opts) {
    fastify.register(jwt, {
        secret: {
            private: readFileSync('./.keys/private.key', 'utf8'),
            public: readFileSync('./.keys/public.key', 'utf8')
        },
    })

    fastify
    .decorate("authenticate", async function(request, reply) {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
        }
    })
    .register(auth)
    .after(async () =>
        fastify.get(
            '/users',
            {
                onRequest: [fastify.authenticate]
            },
            async function(request, reply) {
                // request.log.info('Auth route')
                // reply.send({ hello: 'world' })
                return request.user
            }
        ),
    )

    function verifyJWT (request, reply, done) {
        const jwt = this.jwt

        // console.log("Passed jwt: " + JSON.stringify(jwt))

        if (request.body && request.body.failureWithReply) {
          reply.code(401).send({ error: 'Unauthorized' })
          return done(new Error())
        }

        if (!request.raw.headers.authorization) {
          return done(new Error('Missing token header'))
        }

        jwt.verify(request.raw.headers.authorization, onVerify)
        return done()
    }

    function onVerify (jwt) {
        console.log("Verified token successfully")
    }
})