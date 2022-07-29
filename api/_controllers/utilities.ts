import errorEmail from "../_devOps/errorEmail";

import Plans, { DBPlan } from "../_models/planModel";

import { bibleStructure, bibleArray } from "../_dataServices";

import { auth0 } from "../_config";

export const verifyPhone = async (user, phone, carrier) => {
  const phoneData =
    user["https://brphones"] &&
    user["https://brphones"].find(
      (p) => p.phone === phone && p.carrier === carrier
    );

  return phoneData && phoneData.verified
    ? { hasPhone: true, verified: true }
    : auth0
        .getUser({ id: user.sub })
        .then((u) => {
          const freshPhoneData =
            u.user_metadata.phones &&
            u.user_metadata.phones.find(
              (p) => p.phone === phone && p.carrier === carrier
            );

          return {
            hasPhone: Boolean(freshPhoneData),
            verified: Boolean(freshPhoneData && freshPhoneData.verified),
          };
        })
        .catch((err) => {
          errorEmail({
            err,
            message: `Error verifying ${phone}`,
            subject: "Phone verification error",
          });
          return { hasPhone: false, verified: false };
        });
};

export const verifyEmail = async (user, email) => {
  const emailData =
    user["https://bremails"] &&
    user["https://bremails"].find((e) => e.email === email);

  return emailData && emailData.verified
    ? { hasEmail: true, verified: true }
    : auth0
        .getUser({ id: user.sub })
        .then((u) => {
          const freshEmailData =
            u.user_metadata.emails &&
            u.user_metadata.emails.find((e) => e.email === email);

          return {
            hasEmail: Boolean(freshEmailData),
            verified: Boolean(freshEmailData && freshEmailData.verified),
          };
        })
        .catch((err) => {
          errorEmail({
            err,
            message: `Error verifying ${email}`,
            subject: "Email verification error",
          });
          return { hasEmail: false, verified: false };
        });
};

export const deletePlan = (planId: string, userId: string): Promise<DBPlan> =>
  new Promise((resolve, reject) => {
    return Plans.findOneAndRemove(
      { _id: planId, userId },
      {},
      (err: Error, result: DBPlan) => (err ? reject(err) : resolve(result))
    );
  });

export const findPlansByIdentifiers = (identifiers: any): Promise<DBPlan[]> =>
  new Promise((resolve, reject) => {
    Plans.find(identifiers, (err: Error, plans: DBPlan[]) =>
      err ? reject(err) : resolve(plans)
    );
  });

export const getPhoneFromString = (string) => {
  return (
    typeof string === "string" &&
    Array.from(string).reduce(
      (phone, char) => (char.match(/\d/) ? phone + char : phone),
      ""
    )
  );
};

export const reduceReferenceStringToObject = (reference) => {
  return reference
    .split(":")[0]
    .split("")
    .reduce(
      (obj, char, index) => {
        if (index === 0) {
          return {
            book: `${char}`,
            chapter: "",
          };
        } else if (char.match(/[0-9]/)) {
          const newChap = (obj.chapter += char);
          return {
            book: obj.book,
            chapter: newChap,
          };
        } else {
          const newBook = (obj.book += char);
          return {
            book: newBook,
            chapter: obj.chapter,
          };
        }
      },
      { book: "", chapter: "" }
    );
};

export const timeOfDayToCronString = (time) => {
  const [hours, minutes] = time.split(":");

  return `00 ${minutes} ${hours} * * 0-6`;
};

export const generateCode = (length) =>
  Array(length || 6)
    .fill(10)
    .map((ten) => Math.floor(ten * Math.random()))
    .join("");

export const isValidJSON = (string) => {
  try {
    JSON.parse(string);

    return string;
  } catch (err) {
    errorEmail({
      subject: "Invalid JSON",
      err,
      message: `Attempted to parse: ${string}\n\n\nResult:`,
    });

    return false;
  }
};

export const referenceFromString = (string) => {
  if (string) {
    const book = string
      .split("")
      .filter((c, i) => !i || !c.match(/[0-9-:]/))
      .join("");
    const index = bibleStructure[book].findIndex((s) => s === string);

    if (index !== -1) {
      return {
        book: book,
        chapter: index + 1,
      };
    }
  }

  return {};
};

export const stringAndIntFromReference = ({ book, chapter }) => {
  const string = bibleStructure[book][chapter - 1];

  return {
    string,
    int: bibleArray.findIndex((b) => b === string),
  };
};

export const dateDifference = (startDate) => {
  const now = new Date();
  const timeDiff = Math.abs(startDate.getTime() - now.getTime());
  const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

  return diffDays;
};
