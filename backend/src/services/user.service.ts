import { prisma } from "@/db/client.js";
import { findUserByEmail } from "@/repository/user.repository.js";
import { CreateUserServiceDto } from "@/types/dto/user/index.js";
import { BadRequestError } from "@/types/error.js";
import argon2 from "argon2";

export async function createUserAccount(props: CreateUserServiceDto) {
  const isUserExists = await findUserByEmail(props.email);

  if (isUserExists) {
    throw new BadRequestError("User with this email already exists");
  }

  const isUserNameExists = await prisma.profile.findUnique({
    where: {
      username: props.username,
    }
  });
  
  if (isUserNameExists) {
    throw new BadRequestError("User with this username already exists");
  }

  const hashedPassword = await argon2.hash(props.password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: props.email,
        password: hashedPassword,
      }
    })

    const profile = await tx.profile.create({
      data: {
        user_id: user.id,
        first_name: props.first_name,
        last_name: props.last_name,
        username: props.username,
      }
    })

    return {
      user,
      profile
    }
  })
  
  return result;
}