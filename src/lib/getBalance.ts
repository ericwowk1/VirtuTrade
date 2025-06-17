import { prisma } from "@/services/prisma";

export const getBalance = async (userId: string): Promise<number> => {
   const user = await prisma.user.findUnique({
     where: { id: userId },
     select: { money: true }
   });
   
   return user?.money || 0;
};