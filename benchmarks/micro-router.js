'use strict'

const micro = require('micro')
const { router, get } = require('microrouter')

const hello = async (req, res) =>
  micro.send(res, 200, {hello: 'world'})


const server = micro(
  router(
    get('/', hello)
  )
)

server.listen(3000)
