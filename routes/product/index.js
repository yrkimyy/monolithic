'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const products = this.mongo.db.collection('products')
    const result = await products.find().toArray();
    return result
  })

  fastify.post('/', async function (request, reply) {
    const {name, price, description} = request.body
    const products = this.mongo.db.collection('products')
    const result = await products.insertOne({name, price, description})
    return result
  })
}
