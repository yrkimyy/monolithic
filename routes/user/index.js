'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/login', async function (request, reply) {
    const {loginname, password} = request.body
    const connection = await fastify.mysql.getConnection()

    const [rows, fields] = await connection.query(
      `SELECT * FROM users WHERE loginname = '${loginname}' and password='${password}'`, []
    )
    connection.release()

    const user = rows[0]
    console.log(user)
    if(rows.length > 0) {
      const redisResult = await fastify.redis.set(user.loginname, JSON.stringify(user))
      console.log(redisResult)
    
      const token = fastify.jwt.sign({"id":user.id, "loginname": loginname})
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
    
    const redisResult = await fastify.redis.get(request.user.loginname)
    if(redisResult){
      console.log("캐시 있음")
      reply.send(redisResult)
      return; 
    }
    console.log("캐시 없음")
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
