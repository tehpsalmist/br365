import { join } from 'path'
import cors from 'cors'
import { urlencoded, json } from 'body-parser'
import mongoose from 'mongoose'
import { expressJwtSecret } from 'jwks-rsa'
import sanitizer from 'sanitize'

import { getDbConnectionString } from './_config'
import errorEmail from './_devOps/errorEmail'
import { apiRouter, webhookRouter } from './_routes/api'
require('tls').DEFAULT_ECDH_CURVE = 'auto'

const express = require('express')
const jwt = require('express-jwt')

const { PRODUCTION, DEV, LATER_ON_BR365_HEADER_SECRET } = process.env
const port = process.env.PORT || 1337

const app = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(sanitizer.middleware)

const checkJwt = jwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://br365.auth0.com/.well-known/jwks.json'
  }),
  aud: 'https://biblereminder365.com/api',
  iss: 'https://br365.auth0.com/',
  algorithms: ['RS256']
})

app.use(express.static(join(__dirname, 'public')))

app.use('/api', checkJwt, apiRouter)
app.use(
  '/webhooks',
  (req, res, next) => {
    if (req.get('X-BR365-SIGNATURE') === LATER_ON_BR365_HEADER_SECRET) {
      return next()
    }

    res
      .status(401)
      .json({ message: 'Unauthorized: request lacked necessary headers' })
  },
  webhookRouter
)

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'))
})

mongoose
  .connect(getDbConnectionString(), {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .catch((err) => {
    console.error(new Date().toUTCString(), err)
    errorEmail({
      err,
      subject: 'Mongoose Error',
      message: 'Connection Error!'
    })
  })

if (PRODUCTION) {
}
if (DEV) {
}

export default app
