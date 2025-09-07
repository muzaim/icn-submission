import { useAuthStore } from '@/stores/authStore';
import { useRouter } from "next/navigation";
import React from 'react'

const Header = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const clearCredentials = () => {
        useAuthStore.getState().clearCredentials();
        router.push("/login");
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-black/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-extrabold text-white tracking-wide cursor-pointer">myplan</h1>

            {user && <p className="text-white ">Hi <span className='font-semibold capitalize'>{user.fullname}</span>, any task today?</p>}

            <button onClick={user ? clearCredentials : () => router.push("/login")} className="border bg-[#06bcd4] border-black text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer">
                {user ? "Logout" : "Login"}
            </button>
        </div>


    )
}

export default Header
