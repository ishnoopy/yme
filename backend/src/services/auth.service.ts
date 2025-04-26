import { GeneralConfig } from "@/config/general.js";
import { findProfileByUserId } from "@/repository/profile.repository.js";
import { findUserByEmail } from "@/repository/user.repository.js";
import { LoginUserServiceDto } from "@/types/dto/user/index.js";
import { BadRequestError } from "@/types/error.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";


export async function loginUserAccount(props: LoginUserServiceDto) {
  const user = await findUserByEmail(props.email, false);

  if (!user) {
    throw new BadRequestError("User with this email does not exist");
  }

  const isPasswordValid = await argon2.verify(user.password, props.password);

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid password");
  }

  const profile = await findProfileByUserId(user.id);
  const { password, ...userWithoutPassword } = user;

  const userProfile = {
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    username: profile?.username,
    ...userWithoutPassword,
  }

  const token = jwt.sign(userProfile, GeneralConfig.jwtSecret, { expiresIn: "1h" });


  return {
    user: userProfile,
    token,
  };
}
