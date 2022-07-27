import errorEmail from "api/_devOps/errorEmail";
import bibleReminderFunk from "./functions/bibleReminderFunk";
import { migration } from "./migration";

export const sendBibleReading = async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(404).json({ message: "resource not found" });
  }

  const success = await bibleReminderFunk(id).catch((err) =>
    err instanceof Error ? err : new Error(JSON.stringify(err))
  );

  if (success instanceof Error) {
    return res.status(500).json({ success: false, error: success });
  }

  return res.status(200).json({ success: true });
};

export const migrate = async (req, res) => {
  res.status(404).json({ message: "resource not found" });
  // const migrated = await migration()
  //   .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

  // if (migrated instanceof Error) {
  //   return res.status(500).json({ error: migrated })
  // }

  // return res.status(200).json({ success: true })
};

export const timerFailure = async (req, res) => {
  console.log(req.body, req.headers);
  const jobId = req.headers["job-id"];
  errorEmail({
    subject: "Timer Failure",
    err: {},
    message: `An error occurred in the timer for job ${jobId}:\n${JSON.stringify(
      req.body,
      null,
      2
    )}`,
  });
};
