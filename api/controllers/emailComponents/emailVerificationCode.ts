import { baseUrl } from '../../config'

export const emailVerificationCode = code => `<h1 style="text-align: center; font-weight: bold;">${code}</h1>
  <p>To verify your email, enter this code at <a href="${baseUrl}">biblereminder365.com</a>.</p>
  <p>If you did not generate a code to verify your email at biblereminder365.com, please disregard this email.</p>`
