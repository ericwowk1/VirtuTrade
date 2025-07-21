import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/services/auth';
import { prisma } from '@/services/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { portfolioHistory: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // The portfolioHistory field can be null, so ensure we return an array
    const history = user.portfolioHistory ?? [];

    return NextResponse.json(history);

  } catch (error) {
    console.error('Failed to fetch portfolio history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}