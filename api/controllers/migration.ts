import Plans from '../models/planModel'
import fetch from 'node-fetch'
import { createTimer } from './functions/timers'
import { sendEmail } from './functions/sendEmail'

const { BIBLE_EMAIL, LATER_ON_REFRESH_TOKEN } = process.env

let access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9EazRSalUxTkRRek5UWkZNVU5ETVVSQ01FWkNRakF3T1RaQ016TTBORGsxTlVNeFJqVkdPQSJ9.eyJpc3MiOiJodHRwczovL2xhdGVyLW9uLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTQyOTMyOTQ2NjMwODU3ODE5NCIsImF1ZCI6WyJodHRwczovL2xhdGVyLW9uLmNvbS9hcGkiLCJodHRwczovL2xhdGVyLW9uLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1NzM2MTE2OTMsImV4cCI6MTU3MzY5ODA5MywiYXpwIjoiVnRXNnZjOFNWYzZTdFBwVkJsUUlaOVhBanFDd2hYbnAiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.c9DKXfpBecV5_Saw7MbFVjlyOPAqtXCGYDSTAdjCaQp2llv9-HmsU8PDXqT7AKDxoSgf2D_vNmipPWBdWY3e0W6VUN1j5gU5LnufFLuTrpalQZHeYn-JUjyDmk4JUsae3UkjMe_KhmsSV4EAZnbFAAgb7laS6iyjTPtqfiVyasYpRNXC_DEzw-AjUVplHq8mmwuvKxWxZhKc3MSZCsGu16O9-Cq_ihwDm-V5GM80YDz_6_PagsgYQZtt-XOKHJmyEn2vBiHbxpgdpccDEocKi6rTupLdfls-NSr1GQ4KmXN4-73IpKdzr12sFi1XMwvttYdlObZwpHaJNN8gKzHH-w'

export const migration = async () => {
  let count = 0
  const logs = []

  return Plans.find().cursor().eachAsync(async plan => {
    count++

    if (plan.activeEmail || plan.activeText) {
      if (plan.timerId) {
        const deletion = await deleteTimer(plan.timerId)
          .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

        if (deletion instanceof Error) {
          logs.push({ pname: plan.planName, id: plan._id, timerId: deletion })

          return console.error(`failed to delete timer ${plan.timerId} on plan ${plan._id}: "${plan.planName}"`)
        }
      }

      const timerId = await createTimer(plan)

      if (!timerId) {
        logs.push({ pname: plan.planName, id: plan._id, timerId })

        return console.error(`failed to create timer on plan ${plan._id}: "${plan.planName}"`)
      }

      const updated = await Plans.findByIdAndUpdate(plan._id, { timerId })
        .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

      if (updated instanceof Error) {
        console.error('Unable to migrate', plan._id)
        console.error('timer ID:', timerId)
      }

      logs.push({ pname: plan.planName, id: plan._id, timerId })
    } else {
      logs.push({ pname: plan.planName, id: plan._id, timerId: null })
    }
  })
    .then(plans => {
      console.log(`${count} plans migrated!`)

      const logHTML = [
        `<h2>${count} plans migrated!</h2><table>`,
        '<thead><tr><th>Name</th><th>Plan ID</th><th>Timer ID</th></tr></thead><tbody>',
        ...logs.map(log => `<tr><td>${log.pname}</td><td>${log.id}</td><td>${log.timerId}</td></tr>`),
        '</tbody></table>'
      ].join('')

      return sendEmail({
        to: BIBLE_EMAIL,
        subject: 'Migration Status',
        html: logHTML
      })
    })
}

async function deleteTimer (originalTimerId) {
  const timerId = await tryFor200(token => fetch(`https://later-on.com/api/jobs/${originalTimerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }))

  return timerId
}

async function tryFor200 (request) {
  try {
    const firstResponse = await request(access_token)

    if (firstResponse.ok) {
      const json = await firstResponse.json()

      return json.job._id
    } else if (firstResponse.status === 401) {
      const refreshBody = await fetch('https://later-on.com/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: LATER_ON_REFRESH_TOKEN
        })
      }).then(r => r.json())

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

