import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	fullname: string;
	name: string;
	email: string;
	password: string;
}

export const loginUser = async ({ email, password }: LoginPayload) => {
	const res = await api.post("/auth/login", { email, password });
	useAuthStore
		.getState()
		.setCredentials(res.data.access_token, res.data.payload);
	return res.data;
};

export const registerUser = async (payload: RegisterPayload) => {
	const { data } = await api.post("/user", payload);
	return data;
};
