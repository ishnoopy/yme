import { Context } from "hono";
import * as v from "valibot";
import { loginUserAccount } from "@/services/auth.service.js";

export async function loginUser(C: Context) {
  const body = await C.req.json();

  const Schema = v.object({
    email: v.string(),
    password: v.string()
  })

  const validatedBody = v.parse(Schema, body);

  const user = await loginUserAccount(validatedBody);

  return C.json(user);
}