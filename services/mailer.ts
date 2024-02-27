import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});
export const mailer = async (email: any, otpToken: any) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "OTP verification",
    html: `<div>Hi ! your OTP code is <b> ${otpToken}</b></div>`,
  });
  return true;
};
