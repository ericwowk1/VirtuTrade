
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LandingPage} from "./components/LandingPage"
import { HomePage } from "./components/HomePage"



 export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session); // Check what this shows
  
  if (!session) {
    console.log("Showing LandingPage"); // This should appear in browser console
    return <LandingPage />
  }
  else {
    console.log("Showing HomePage");
    return <HomePage />
  }
}