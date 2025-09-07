import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComponentType } from "react";
import { useAuthStore } from "@/stores/authStore";

const withGuest = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const ComponentWithGuest = (props: P) => {
        const router = useRouter();
        const token = useAuthStore((state) => state.token);

        useEffect(() => {
            if (token) {
                router.replace("/todo");
            }
        }, [token]);

        if (token) return null;

        return <WrappedComponent {...props} />;
    };

    return ComponentWithGuest;
};

export default withGuest;
