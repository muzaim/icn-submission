"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useApiMutation } from "@/hooks/useApi";
import { loginUser, LoginPayload } from "@/services/auth";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import withGuest from "@/hoc/withGuest";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "At least 6 chars")
        .required("Password is required"),
});

const Login = () => {
    const loginMutation = useApiMutation(loginUser);
    const router = useRouter();


    return (
        <div className="h-screen w-screen overflow-hidden bg-black text-white flex">
            <div className="flex-1 bg-[url('/pico.jpg')] bg-cover bg-center"></div>

            <div className="flex-1 flex items-center justify-center bg-black flex-col gap-6 px-6">
                <div className="flex flex-col gap-2 text-center">
                    <h3 className="text-3xl font-bold">Welcome Back 👋</h3>
                    <span className="text-gray-400">Login to stay connected</span>
                </div>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        loginMutation.mutate(values as LoginPayload, {
                            onSuccess: (data) => {
                                console.log("✅ Login success:", data);

                                useAuthStore.getState().setCredentials(
                                    data.access_token,
                                    data.payload
                                );

                                router.push("/todo");
                            },
                            onError: (error) => {
                                console.error("❌ Login error:", error);
                            },
                            onSettled: () => {
                                setSubmitting(false);
                            },
                        });
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-white/10">
                            <div>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-400 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-red-400 text-sm mt-1"
                                />
                            </div>

                            {loginMutation.isError && (
                                <p className="text-red-400 text-sm mt-2">
                                    {loginMutation.error instanceof AxiosError
                                        ? loginMutation.error.response?.data?.message
                                        : "Something went wrong"}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || loginMutation.isPending}
                                className="w-full bg-white text-black font-semibold py-3 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
                            >
                                {loginMutation.isPending ? "Logging in..." : "Login"}
                            </button>

                            <div className="flex items-center gap-4">
                                <hr className="flex-1 border-gray-600" />
                                <span className="text-gray-500 text-sm">OR</span>
                                <hr className="flex-1 border-gray-600" />
                            </div>

                            <Link
                                href="/register"
                                className="w-full border border-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-black transition text-center"
                            >
                                Sign Up
                            </Link>
                        </Form>
                    )}
                </Formik>
            </div>
        </div >
    );
};

export default withGuest(Login); 