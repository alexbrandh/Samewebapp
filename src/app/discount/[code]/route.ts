import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;
    const searchParams = request.nextUrl.searchParams;
    const redirectPath = searchParams.get('redirect') || '/';

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    // Set discount cookie (valid for 7 days)
    response.cookies.set('discount_code', code, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: false, // Accessible by JS if needed (e.g. UI display)
        sameSite: 'lax'
    });

    return response;
}
