"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useApiMutation } from "@/hooks/useApi";
import { registerUser, RegisterPayload } from "@/services/auth";
import { AxiosError } from "axios";
import withGuest from "@/hoc/withGuest";

const validationSchema = Yup.object({
    fullname: Yup.string().required("Fullname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "At least 6 chars").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
});

const RegisterPage = () => {
    const registerMutation = useApiMutation(registerUser);

    return (
        <Formik
            initialValues={{ fullname: "", email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                registerMutation.mutate(
                    { fullname: values.fullname, email: values.email, password: values.password } as RegisterPayload,
                    {
                        onSuccess: () => {
                            resetForm();
                        },
                        onError: (error) => {
                            console.error("❌ Error:", error);
                        },
                        onSettled: () => {
                            setSubmitting(false);
                        },
                    }
                );
            }}
        >
            {({ isSubmitting }) => (
                <Form className="h-screen w-screen overflow-hidden bg-black text-white flex">
                    <div className="flex-1 bg-[url('/pico.jpg')] bg-cover bg-center"></div>

                    <div className="flex-1 flex items-center justify-center bg-black flex-col gap-6 px-6">
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-3xl font-bold">Create Account ✨</h3>
                            <span className="text-gray-400">Register to get started</span>
                        </div>

                        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-white/10">
                            <div>
                                <Field
                                    type="text"
                                    name="fullname"
                                    placeholder="Full name"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                                />
                                <ErrorMessage name="fullname" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || registerMutation.isPending}
                                className="w-full bg-white text-black font-semibold py-3 rounded-lg shadow-md hover:bg-gray-200 transition"
                            >
                                {isSubmitting || registerMutation.isPending ? "Submitting..." : "Sign Up"}
                            </button>

                            <div className="flex items-center gap-4">
                                <hr className="flex-1 border-gray-600" />
                                <span className="text-gray-500 text-sm">OR</span>
                                <hr className="flex-1 border-gray-600" />
                            </div>

                            <Link
                                href="/login"
                                className="w-full text-center border border-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-black transition"
                            >
                                Already have an account? Login
                            </Link>

                            {registerMutation.isError && (
                                <p className="text-red-400 text-sm mt-2">
                                    {(registerMutation.error as AxiosError<{ message: string }>)?.response?.data?.message ||
                                        "Something went wrong"}
                                </p>
                            )}
                            {registerMutation.isSuccess && (
                                <p className="text-green-400 text-sm mt-2">Registration successful 🎉</p>
                            )}
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default withGuest(RegisterPage); 