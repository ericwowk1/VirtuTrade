'use client';
import { useSession } from 'next-auth/react';
import Welcome from "./components/HomePage";

export default function Home() {


  return (
    <div>
      <Welcome />
    </div>
  );
}