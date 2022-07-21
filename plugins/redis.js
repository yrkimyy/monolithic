'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/redis'), { 
    host: process.env.REDIS_HOSTNAME, 
    port: process.env.REDIS_PORT, // Redis port
    password : process.env.REDIS_PASSWORD,
    family: 4,   // 4 (IPv4) or 6 (IPv6)
  })
})
