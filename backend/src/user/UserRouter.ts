import express from "express";
import { CustomRequest, CreateUserDTO } from "./dtos";
import { check, validationResult } from "express-validator";

import { save } from "./UserService";

const router = express.Router();

router.post(
  "/api/1.0/users",
  check("username")
    .notEmpty()
    .withMessage("Username cannot be null")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Must have min 4 and max 32 characters"),
  check("email").notEmpty().withMessage("Email cannot be null"),
  check("password").notEmpty().withMessage("Password cannot be null"),
  async (req: CustomRequest<CreateUserDTO>, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors
        .array()
        .reduce((acc, error) => ({ ...acc, [error.param]: error.msg }), {});
      return res.status(400).send({ validationErrors });
    }

    const user = { ...req.body };
    await save(user);

    return res.status(201).send({ message: "User Created" });
  }
);

export default router;
