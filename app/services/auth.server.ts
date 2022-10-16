// app/services/auth.server.ts
import { FormStrategy } from "remix-auth-form";
import { Authenticator } from "remix-auth";
import { sessionStorage, User } from "~/services/session.server";
import invariant from "tiny-invariant";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    // You can validate the inputs however you want
    // invariant(typeof username === "string", "username must be a string");
    // invariant(username.length > 0, "username must not be empty");

    // invariant(typeof password === "string", "password must be a string");
    // invariant(password.length > 0, "password must not be empty");

    // // And if you have a password you should hash it
    const hashedPassword = await hashCode(password);

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;
    let user = null;

    if (email === adminUser && password === adminPassword) {
      user = {
        name: email,
        token: `${hashedPassword}-${new Date().getTime()}`,
      };
    }
    return user;
  }),
  "user-pass"
);

async function hashCode(str) {
  var hash = 0,
    i = 0,
    len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return hash;
}
