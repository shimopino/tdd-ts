import express from "express";
import i18next from "i18next";
import backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import UserRouter from "./user/UserRouter";

i18next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    lng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      lookupHeader: "accept-language",
    },
  });

const app = express();

app.use(middleware.handle(i18next));

app.use(express.json());

app.use(UserRouter);

export { app };
