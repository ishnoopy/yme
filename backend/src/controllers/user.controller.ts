import type { Context } from "hono";
import * as v from "valibot";
import { findUserById, findAllUsers } from "@/repository/user.repository.js";
import { createUserAccount } from "@/services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "@/types/error.js";

export async function getUsers(C: Context) {
  const users = await findAllUsers();
  const usersWithoutPassword = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return C.json(usersWithoutPassword);
}

export async function getUserById(C: Context) {

  const params = C.req.param();

  const Schema = v.object({
    id: v.string()
  })

  const { id } = v.parse(Schema, params)

  const user = await findUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return C.json(user);
}

export async function createUser(C: Context) {
  const body = await C.req.json();

  const Schema = v.object({
    email: v.string(),
    password: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    username: v.string(),
    profile_picture: v.optional(v.string()),
  })

  const validatedBody = v.parse(Schema, body);
  const user = await createUserAccount(validatedBody);
  const { user: { password, ...userWithoutPassword }, profile } = user;
  
  return C.json({ user: userWithoutPassword, profile }, StatusCodes.CREATED)
}