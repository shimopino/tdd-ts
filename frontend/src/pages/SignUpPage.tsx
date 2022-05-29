import React, { useState } from "react";

export const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.currentTarget.value;
    setPassword(currentInput);
    if (currentInput && passwordRepeat)
      setDisabled(currentInput !== passwordRepeat);
  };

  const onChangePasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("called");
    const currentInput = e.currentTarget.value;
    setPasswordRepeat(currentInput);
    if (password && currentInput) setDisabled(password !== currentInput);
  };

  console.log({ password, passwordRepeat, disabled });

  return (
    <>
      <h1>Sign Up</h1>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" />
      <label htmlFor="email">Email</label>
      <input id="email" type="text" />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={onChangePassword}
      />
      <label htmlFor="passwordRepeat">Password Repeat</label>
      <input
        id="passwordRepeat"
        type="password"
        value={passwordRepeat}
        onChange={onChangePasswordRepeat}
      />
      <button disabled={disabled}>Sign Up</button>
    </>
  );
};
