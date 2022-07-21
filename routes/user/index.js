'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/login', async function (request, reply) {
    const {loginname, password} = request.body
    const connection = await fastify.mysql.getConnection()

    const [rows, fields] = await connection.query(
      `SELECT * FROM users WHERE loginname = '${loginname}' and password='${password}'`, []
    )
    connection.release()
    if(rows.length > 0) {
      const token = fastify.jwt.sign({"id":rows[0].id, "loginname": loginname})
      reply.send({ token })
    } else {
      reply.send("유효한 로그인네임과 패스워드가 아닙니다.").status(401)
    }
  })

  fastify.decorate("authenticate", async function(request, reply){
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.get("/", {
    onRequest:[fastify.authenticate]
  }, 
  async function(request, reply) {
    console.log("request.user", request.user)
    const connection = await fastify.mysql.getConnection()

    const [rows, fields] = await connection.query(
      `SELECT * FROM users WHERE id = '${request.user.id}'`, []
    )
    connection.release()
    console.log(rows)
    return rows[0]
  })

  fastify.post("/signup", async function (request, reply){
    const {loginname, password, name} = request.body

    const connection = await fastify.mysql.getConnection()
    const [rows, fields] = await connection.query(
      `insert into users (loginname, password, name) values (?, ?, ?)`, [loginname, password, name]
    )
    connection.release()
    return rows[0]
  })

}
