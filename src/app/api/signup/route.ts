import { NextResponse } from 'next/server';
import { AddNewUser } from "@/services/CreateAccount";


export async function GET(request: Request) {
try {
   const { searchParams } = new URL(request.url);
   const username = searchParams.get('username');
   const password = searchParams.get('password');
   if (!username || !password) {
     return NextResponse.json({ success: false, error: 'Missing username or password' }, { status: 400 });
   }
   const result = await AddNewUser(username, password);
   return NextResponse.json({ success: true, result });
}
catch (error) {
return NextResponse.json({ success: false}, { status: 500 });
}
}