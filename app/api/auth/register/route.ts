import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
  setAuthCookies,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, phoneNumber } = await req.json();

    // Validation
    if (!fullName || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phoneNumber,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
      },
    });

    console.log("✅ User registered:", newUser);

    // Create session
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    // Get request metadata for security tracking
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;

    await prisma.session.create({
      data: {
        sessionToken: hashedRefreshToken,
        userId: newUser.id,
        expires: getRefreshTokenExpiry(),
        ipAddress,
        userAgent,
      },
    });

    // Generate access token
    const accessToken = await generateAccessToken(newUser.id);

    // Create response with cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: newUser,
      },
      { status: 201 }
    );

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
