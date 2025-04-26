import { prisma } from "@/db/client.js";
import { CreateProfileDto } from "@/types/dto/profile/index.js";

export async function insertProfile(props: CreateProfileDto) {
  const profile = await prisma.profile.create({
    data: {
      ...props,
    },
  });
  return profile;
}

export async function findProfileByUserId(user_id: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      user_id: user_id,
    },
  });
  return profile;
}
