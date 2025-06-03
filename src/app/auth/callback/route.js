import { NextResponse } from "next/server";

export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  
  // Ambil redirect URL dari query parameter
  const redirectTo = searchParams.get('redirect') || '/';
  
  // Pastikan redirect URL aman (tidak ke domain lain)
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';
  
  return NextResponse.redirect(origin + safeRedirect);
}