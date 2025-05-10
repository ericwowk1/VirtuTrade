// Service function to send new user to database
import { prisma } from '@/services/prisma'

export const AddNewUser = async (username: string, password: string) => {
   try {
     const user = await prisma.user.create({
       data: {
         username,
         password,
       },
     });
     return user;
   } catch (error) {
     throw error;
   }
 };