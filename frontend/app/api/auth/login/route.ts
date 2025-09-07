import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password } = body;

		if (email === "test@example.com" && password === "123456") {
			return NextResponse.json({
				success: true,
				message: "Login success",
				token: "dummy-token",
			});
		}

		return NextResponse.json(
			{ success: false, message: "Invalid credentials" },
			{ status: 401 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Server error", error },
			{ status: 500 }
		);
	}
}
