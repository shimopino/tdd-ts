import nodeMailer from "nodemailer";
// @ts-expect-error 公式の型情報がないので一旦無視する
import { stubTransport } from "nodemailer-stub";

const transporter = nodeMailer.createTransport(stubTransport);

const sendAccountActivation = async (email: string, token: string) => {
  await transporter.sendMail({
    from: "My App <info@my-app.com>",
    to: email,
    subject: "Account Activation",
    html: `Token is ${token}`,
  });
};

export { sendAccountActivation };
