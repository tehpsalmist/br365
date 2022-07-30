import { Router } from "express";
import {
  createPlan,
  getPlan,
  updatePlan,
  deletePlanRoute,
  getAllPlans,
  recoverPlans,
} from "../_controllers/plans";
import {
  updateUserName,
  removeUserEmail,
  removeUserPhone,
  deleteUser,
  requestEmailVerification,
  requestTextVerification,
  resendVerificationEmail,
  resendVerificationText,
  submitVerificationCode,
} from "../_controllers/users";
import { getChapter } from "../_controllers/bible";
import {
  sendBibleReading,
  migrate,
  timerFailure,
  textFailure,
} from "../_controllers/triggers";

const apiRouter = Router();
const webhookRouter = Router();

apiRouter.post("/plan", createPlan);
apiRouter.get("/plan/:id", getPlan);
apiRouter.put("/plan/:id", updatePlan);
apiRouter.delete("/plan/:id", deletePlanRoute);
apiRouter.get("/plans", getAllPlans);
apiRouter.post("/plans", recoverPlans);
apiRouter.put("/user/name", updateUserName);
apiRouter.delete("/user/email/:email", removeUserEmail);
apiRouter.delete("/user/phone/:phone", removeUserPhone);
apiRouter.delete("/user", deleteUser);
apiRouter.post("/requestEmailVerification", requestEmailVerification);
apiRouter.post("/requestTextVerification", requestTextVerification);
apiRouter.post("/resendVerificationEmail", resendVerificationEmail);
apiRouter.post("/resendVerificationText", resendVerificationText);
apiRouter.post("/submitVerificationCode", submitVerificationCode);
apiRouter.get("/bible/:version/:chapter", getChapter);
webhookRouter.post("/sendBibleReading", sendBibleReading);
webhookRouter.post("/timerFailure", timerFailure);
webhookRouter.get("/migrate", migrate);
webhookRouter.get("/text-failures", textFailure);

export { apiRouter, webhookRouter };
