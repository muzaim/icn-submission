import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, email, password } = body;

		if (!name || !email || !password) {
			return NextResponse.json(
				{ success: false, message: "All fields are required" },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "User registered successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Server error", error },
			{ status: 500 }
		);
	}
}
