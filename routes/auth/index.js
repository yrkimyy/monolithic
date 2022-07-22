'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {

    const { response_type, client_id, redirect_uri, scope, state } = request.query

    const isLogin = true
    if(isLogin && response_type === 'code') {
      // callback uri로 redirect
      // allow, deny 화면은 일단은 생략한다
      reply.redirect(302, redirect_uri)
    }
    else {
      // login 화면으로 보낸다
      reply.redirect(302, '/login')
    }
    
  })
}
