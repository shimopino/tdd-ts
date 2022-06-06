import express from "express";
import { CustomRequest, CreateUserDTO } from "./dtos";
import { check, validationResult } from "express-validator";
import { findByEmail, save } from "./UserService";

const router = express.Router();

router.post(
  "/api/1.0/users",
  check("username")
    .notEmpty()
    .withMessage("username_null")
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage("username_size"),
  check("email")
    .notEmpty()
    .withMessage("email_null")
    .bail()
    .isEmail()
    .withMessage("email_invalid")
    .custom(async (email) => {
      const user = await findByEmail(email);
      if (user) {
        throw new Error("email_in_use");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password_null")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password_size")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage("password_pattern"),
  async (req: CustomRequest<CreateUserDTO>, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors
        .array()
        .reduce(
          (acc, error) => ({ ...acc, [error.param]: req.t(error.msg) }),
          {}
        );
      return res.status(400).send({ validationErrors });
    }

    try {
      const user = { ...req.body };
      await save(user);
      return res.status(201).send({ message: req.t("user_create_success") });
    } catch (err) {
      return res.status(502).send({ message: req.t("email_failure") });
    }
  }
);

export default router;
