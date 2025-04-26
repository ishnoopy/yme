import { BadRequestError } from "@/types/error.js";
import { prisma } from "@/db/client.js";
import { CreateUserRepositoryDto } from "@/types/dto/user/index.js";
import { User } from "generated/prisma/client.js";

export async function insertUser(props: CreateUserRepositoryDto) {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: props.email,
    },
  });

  if (isUserExists) {
    throw new BadRequestError("User already exists");
  }

  console.log("👁️")
  const user = await prisma.user.create({
    data: {
      ...props,
    },
  });
  console.log("🚀")

  return user;
}

export async function findAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function findUserById(id: string, omit_password = true) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      received_messages: true
    },
  })

  if (omit_password && user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return user;
}

export async function findUserByEmail(email: string, omit_password = true): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (omit_password && user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  return user;
}