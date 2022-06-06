export class EmailException extends Error {
  constructor() {
    super();
    this.name = EmailException.name;
    this.message = "email_failure";
  }
}
