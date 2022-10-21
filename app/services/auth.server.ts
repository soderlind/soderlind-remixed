// app/services/auth.server.ts
import { FormStrategy } from "remix-auth-form";
import { Authenticator } from "remix-auth";
import { sessionStorage, User } from "~/services/session.server";
import invariant from "tiny-invariant";
import { StringSchemaType } from "sanity";
import { zx } from "zodix";
import { z } from "zod";
// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const { email, password } = await zx.parseForm(form, {
    email: z.string().email(),
    password: z.string(),
  });

  const hashedPassword = await hashCode(password);

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminUser && password === adminPassword) {
    return {
      name: email,
      token: `${hashedPassword}-${new Date().getTime()}`,
    };
  }
  return null;
});

// Tell the Authenticator to use the form strategy
authenticator.use(formStrategy, "user-pass");

async function hashCode(str: string) {
  let hash = 0;
  let i = 0;
  const len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return hash;
}
