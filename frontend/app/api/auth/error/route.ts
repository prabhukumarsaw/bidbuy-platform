import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ 
    error: 'Authentication error',
    message: 'An error occurred during authentication'
  }, { status: 401 });
}