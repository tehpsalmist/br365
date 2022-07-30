import { createTransport, SendMailOptions } from "nodemailer";
import twilio from "twilio";

const tw = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const {
  BIBLE_EMAIL,
  BIBLE_EMAIL_CLIENT_ID,
  BIBLE_EMAIL_CLIENT_SECRET,
  BIBLE_EMAIL_REFRESH_TOKEN,
} = process.env;

const smtpTransport = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: BIBLE_EMAIL,
    type: "oauth2",
    clientId: BIBLE_EMAIL_CLIENT_ID,
    clientSecret: BIBLE_EMAIL_CLIENT_SECRET,
    refreshToken: BIBLE_EMAIL_REFRESH_TOKEN,
  },
});

export const sendEmail = function (mailOptions: Omit<SendMailOptions, "from">) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(
      {
        from: BIBLE_EMAIL,
        ...mailOptions,
      },
      (error, response) => {
        if (error || response.rejected[0]) return reject(error || response);
        return resolve(response);
      }
    );
  });
};
interface TextOptions
  extends Omit<SendMailOptions, "from" | "to" | "text" | "subject"> {
  to: string;
  text: string;
  subject: string;
}
export const sendText = function (textOptions: TextOptions) {
  if (textOptions.to.includes("tmomail")) {
    return new Promise((resolve, reject) => {
      tw.messages.create(
        {
          to: `${textOptions.to.split("@")[0]}`,
          from: "2677159614",
          body: textOptions.text,
        },
        (err, resp) => (err ? reject(err) : resolve(resp))
      );
    });
  }

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(
      {
        from: BIBLE_EMAIL,
        ...textOptions,
        subject: textOptions.subject
          ? textOptions.subject.substring(
              0,
              140 - 6 - BIBLE_EMAIL.length - textOptions.text.length
            )
          : "BR365",
      },
      (error, response) => {
        if (error || response.rejected[0]) return reject(error || response);
        return resolve(response);
      }
    );
  });
};
