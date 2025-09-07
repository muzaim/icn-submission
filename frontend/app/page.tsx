"use client";

import Header from "@/components/header";
import Hero from "@/components/hero";
import withGuest from "@/hoc/withGuest";

const App = () => {


  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white flex flex-col relative">
      <Header />
      <Hero />
    </div>
  );
}

export default withGuest(App); 