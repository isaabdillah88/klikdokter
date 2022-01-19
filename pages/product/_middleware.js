import { NextResponse } from "next/server";

export default function middleware(req) {
    const { token } = req.cookies;
    if(!token) {
        return NextResponse.redirect('/auth/login');
    }
}
