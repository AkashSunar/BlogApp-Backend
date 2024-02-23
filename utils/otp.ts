import { totp } from "otplib";
require("dotenv").config();

totp.options = { digtst: 6, step: Number(process.env.OTP_DURATION) };

export const generateOTP = () => {
  totp.options = { digits: 6, step: 120 };
  return totp.generate(process.env.OTP_SECRET || "");
};
export const verifyOTP = (token: string) => {
  totp.options = { digits: 6, step: 120 };
  return totp.check(token, process.env.OTP_SECRET || "");
};
