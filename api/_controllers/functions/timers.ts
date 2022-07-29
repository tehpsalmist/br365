import fetch from 'node-fetch'

import { baseUrl } from '../../_config'
import { timeOfDayToCronString } from '../utilities'

const {
  LATER_ON_REFRESH_TOKEN,
  LATER_ON_BR365_HEADER_SECRET,
  LATER_ON_BR365_ACCESS_TOKEN
} = process.env

let access_token = LATER_ON_BR365_ACCESS_TOKEN

export const createTimer = async (plan) => {
  const id = plan._id
  const cronString = timeOfDayToCronString(plan.time)
  const zone = plan.timeZone

  const timerId = await tryFor200((token) =>
    fetch('https://later-on.com/api/jobs', {
      method: 'POST',
      body: JSON.stringify({
        actionUrl: `${baseUrl}/webhooks/sendBibleReading`,
        payload: { id },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BR365-SIGNATURE': LATER_ON_BR365_HEADER_SECRET
        },
        time: cronString,
        timeZone: zone,
        failureLogging: true,
        failureUrl: `${baseUrl}/webhooks/timerFailure`
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  )

  return timerId
}

export const updateTimer = async (plan) => {
  const id = plan._id
  const cronString = timeOfDayToCronString(plan.time)
  const zone = plan.timeZone
  const originalTimerId = plan.timerId

  if (!originalTimerId) return null

  const timerId = await tryFor200((token) =>
    fetch(`https://later-on.com/api/jobs/${originalTimerId}`, {
      method: 'PUT',
      body: JSON.stringify({
        actionUrl: `${baseUrl}/webhooks/sendBibleReading`,
        payload: { id },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BR365-SIGNATURE': LATER_ON_BR365_HEADER_SECRET
        },
        time: cronString,
        timeZone: zone,
        failureLogging: true,
        failureUrl: `${baseUrl}/webhooks/timerFailure`
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  )

  return timerId
}

export const deleteTimer = async (originalTimerId) => {
  const timerId = await tryFor200((token) =>
    fetch(`https://later-on.com/api/jobs/${originalTimerId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  )

  return timerId
}

async function tryFor200 (request) {
  try {
    const firstResponse = await request(access_token)

    if (firstResponse.ok) {
      const json = await firstResponse.json()

      return json.job._id
    } else if (firstResponse.status === 401) {
      const refreshBody = await fetch(
        'https://later-on.com/api/auth/refresh-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: LATER_ON_REFRESH_TOKEN
          })
        }
      ).then((r) => r.json())

      access_token = refreshBody.authData.access_token

      const secondResponse = await request(access_token)

      if (secondResponse.ok) {
        const json = await secondResponse.json()

        return json.job._id
      }
    }

    return null
  } catch (e) {
    console.error('trying to hit Later On:', e)

    return null
  }
}
