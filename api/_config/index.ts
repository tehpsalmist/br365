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
  ? 'mongodb://localhost:27017'
  : `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@biblereminder.ie62b.mongodb.net/biblereminder?retryWrites=true&w=majority`

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
