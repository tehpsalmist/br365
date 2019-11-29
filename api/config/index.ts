import { ManagementClient } from 'auth0'
import Redis from 'ioredis'

const {
  DEV,
  BIBLE_AUTH0_SERVER_CLIENT_ID,
  BIBLE_AUTH0_SERVER_CLIENT_SECRET,
  MONGO_USER,
  MONGO_PASSWORD,
  REDIS_AUTH,
  REDIS_ENDPOINT,
  REDIS_PORT,
  NGROK_URL
} = process.env

export const getDbConnectionString = () => DEV
  ? `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@ds117101.mlab.com:17101/br365test`
  : `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@ds111618.mlab.com:11618/biblereminder`

export const auth0 = new ManagementClient({
  domain: 'br365.auth0.com',
  clientId: BIBLE_AUTH0_SERVER_CLIENT_ID,
  clientSecret: BIBLE_AUTH0_SERVER_CLIENT_SECRET
})

export const redis = new Redis(REDIS_ENDPOINT, {
  password: REDIS_AUTH,
  port: REDIS_PORT,
  lazyConnect: true
})

export const baseUrl = DEV ? NGROK_URL : 'https://biblereminder365.com'
