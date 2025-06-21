import { NextRequest } from "next/server";
import { getBalance } from "@/services/getBalance";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    // Check authentication first
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await the async function!
    const balance = await getBalance(session.user.id);
    console.log("Balance", balance)
    
    return Response.json({ balance });
  } catch (error) {
    console.log("error Getting User Balance", error);
    return Response.json({ error: "Failed to fetch User Balance" }, { status: 500 });
  }
}