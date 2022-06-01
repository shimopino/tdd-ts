import nodeMailer from "nodemailer";
// @ts-expect-error 公式の型情報がないので一旦無視する
import { stubTransport } from "nodemailer-stub";

const transporter = nodeMailer.createTransport(stubTransport);

export { transporter };
