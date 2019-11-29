import { Router } from 'express'
const apiRouter = Router()
const webhookRouter = Router()

import { createPlan, getPlan, updatePlan, deletePlanRoute, getAllPlans, recoverPlans } from '../controllers/plans'
import { updateUserName, removeUserEmail, removeUserPhone, deleteUser, requestEmailVerification, requestTextVerification, resendVerificationEmail, resendVerificationText, submitVerificationCode } from '../controllers/users'
import { getChapter } from '../controllers/bible'
import { sendBibleReading, migrate } from '../controllers/triggers'

apiRouter.post('/plan', createPlan)
apiRouter.get('/plan/:id', getPlan)
apiRouter.put('/plan/:id', updatePlan)
apiRouter.delete('/plan/:id', deletePlanRoute)
apiRouter.get('/plans', getAllPlans)
apiRouter.post('/plans', recoverPlans)
apiRouter.put('/user/name', updateUserName)
apiRouter.delete('/user/email/:email', removeUserEmail)
apiRouter.delete('/user/phone/:phone', removeUserPhone)
apiRouter.delete('/user', deleteUser)
apiRouter.post('/requestEmailVerification', requestEmailVerification)
apiRouter.post('/requestTextVerification', requestTextVerification)
apiRouter.post('/resendVerificationEmail', resendVerificationEmail)
apiRouter.post('/resendVerificationText', resendVerificationText)
apiRouter.post('/submitVerificationCode', submitVerificationCode)
apiRouter.get('/bible/:version/:chapter', getChapter)
webhookRouter.post('/sendBibleReading', sendBibleReading)
webhookRouter.get('/migrate', migrate)

export {
  apiRouter,
  webhookRouter
}
