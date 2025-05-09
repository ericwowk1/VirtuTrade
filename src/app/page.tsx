import Image from "next/image";
import Welcome from "./components/welcome";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">

<Welcome 
        title="Welcome to Our Platform" 
        description="This text is being passed down as props from the homepage to the Welcome component" 
      />
      <h1 className="text-4xl font-bold mt-10">MY APP!!!</h1>

      <div className="mt-8 flex flex-col items-center">
        <p className="mb-6 text-center max-w-lg">
          Below is an image imported using Next.js Image component for optimized loading
        </p>
        
        <Image 
          src="/next.svg" 
          alt="Next.js Logo" 
          width={180} 
          height={37} 
          priority
        />
      </div>
    </main>
  );
}