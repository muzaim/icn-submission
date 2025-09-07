import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComponentType } from "react";
import { useAuthStore } from "@/stores/authStore";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {

	const ComponentWithAuth = (props: P) => {
		const router = useRouter();
		const token = useAuthStore((state) => state.token);
		const hydrated = useAuthStore((state) => state.hasHydrated);

		useEffect(() => {
			if (hydrated && !token) {
				router.replace("/login");
			}
		}, [token, hydrated, router]);

		if (!hydrated || !token) {
			return (
				<div className="flex items-center justify-center h-screen bg-black">
					<div className="flex flex-col items-center">

					</div>
				</div>
			);
		}

		if (!token) return null;

		return <WrappedComponent {...props} />;
	};

	return ComponentWithAuth;
};

export default withAuth;
