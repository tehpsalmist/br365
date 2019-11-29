const path = require('path')
require('tls').DEFAULT_ECDH_CURVE = 'auto'

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const sanitizer = require('sanitize')

const config = require('./config')
const errorEmail = require('./devOps/errorEmail')
const { migration } = require('./controllers/migration')
const { apiRouter, webhookRouter } = require('./routes/api')

const { PRODUCTION, DEV, LATER_ON_BR365_HEADER_SECRET } = process.env
const port = process.env.PORT || 1337

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(sanitizer.middleware)

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://br365.auth0.com/.well-known/jwks.json`
  }),
  aud: 'https://biblereminder365.com/api',
  iss: `https://br365.auth0.com/`,
  algorithms: ['RS256']
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', checkJwt, apiRouter)
app.use('/webhooks', (req, res, next) => {
  if (req.get('X-BR365-SIGNATURE') === LATER_ON_BR365_HEADER_SECRET) {
    return next()
  }

  res.status(401).json({ message: 'Unauthorized: request lacked necessary headers' })
}, webhookRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

mongoose.connect(config.getDbConnectionString(), {
  useNewUrlParser: true,
  useFindAndModify: false,
  reconnectInterval: 1000,
  reconnectTries: Number.MAX_VALUE
}).catch(err => {
  console.error(new Date().toUTCString(), err)
  errorEmail({
    err,
    subject: 'Mongoose Error',
    message: 'Connection Error!'
  })
})

if (PRODUCTION) { }
if (DEV) { }

app.listen(port, () => console.log(`Server launched!`))
