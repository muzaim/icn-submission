import Image from 'next/image'
import React from 'react'

const Hero = () => {
    return (
        <section className="relative  w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-16 pt-20  to-black text-white overflow-hidden">
            <div className="relative z-10 flex-1 max-w-xl text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                    Smarter Task Management <br />
                    <span className="relative text-gray-200">
                        Integrated with <span className=" text-[#06bcd4]">AI</span>
                    </span>
                </h1>
                <p className="text-lg text-gray-400 mb-10">
                    Organize your workflow with clarity and speed.
                    Let our AI assist you in prioritizing, planning, and staying productive — effortlessly.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                    <button className="bg-[#06bcd4] text-white px-7 py-3 rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer">
                        Get Started
                    </button>
                    <button className="border border-gray-400 px-7 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition duration-300 cursor-pointer">
                        Learn More
                    </button>
                </div>
            </div>

            <div className="relative h-full z-10 flex-1 mt-12 md:mt-0 flex justify-center">

                <div className="absolute w-[280px] bg-gradient-to-r from-white to-gray-50 text-gray-900 
                  p-4 rounded-l-2xl shadow-2xl border border-gray-100
                  top-[100px] left-[120px]">
                    <p className="text-sm font-medium italic leading-relaxed">
                        “This AI-powered task manager completely changed how I organize my day. Super efficient!”
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <Image
                            src="https://randomuser.me/api/portraits/women/65.jpg"
                            alt="Sarah"
                            className="w-9 h-9 rounded-full object-cover shadow"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold">Sarah J.</span>
                            <span className="text-[11px] text-gray-500">Product Designer</span>
                        </div>
                    </div>
                </div>

                <div className="absolute w-[250px] bg-gradient-to-r from-white to-gray-50 text-gray-900 
                  p-4 rounded-r-2xl shadow-2xl border border-gray-100
                  top-[400px] right-[120px] ">
                    <p className="text-sm font-medium italic leading-relaxed">
                        “The AI suggestions keep me focused on what really matters. Highly recommend!”
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <Image
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="Michael"
                            className="w-9 h-9 rounded-full object-cover shadow"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold">Michael B.</span>
                            <span className="text-[11px] text-gray-500">Software Engineer</span>
                        </div>
                    </div>
                </div>

                <Image
                    src="/pico.jpg"
                    alt="AI Productivity Illustration"
                    width={500}
                    height={500}
                    className='rounded-t-[5rem] mt-[10rem]'
                />
            </div>


        </section>
    )
}

export default Hero
