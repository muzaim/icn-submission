import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	email: string;
	fullname: string;
}

interface AuthState {
	token: string | null;
	user: User | null;
	setCredentials: (token: string, user: User) => void;
	clearCredentials: () => void;
	hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			setCredentials: (token, user) => set({ token, user }),
			clearCredentials: () => set({ token: null, user: null }),
			hasHydrated: false,
			setHasHydrated: (state) => set({ hasHydrated: state }),
		}),
		{
			name: "auth-storage",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);
