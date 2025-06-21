import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";

export const getBalance = async (userId: string): Promise<number> => {
  
  let userIdToUse = userId;
  const user = await prisma.user.findUnique({
    where: { id: userIdToUse },
    select: { money: true }
  });
  
  return user?.money || 0;
};