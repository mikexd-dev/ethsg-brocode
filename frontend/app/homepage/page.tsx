"use client";

import Navbar from "@/components/Homepage/Navbar";
import Sidebar from "@/components/Homepage/Sidebar";
import "./styles.css";
import Funds from "@/components/Homepage/Funds";
import Charities from "@/components/Homepage/Charities";

const Homepage = () => {

    return <div className="bg-[#F5F4F3] h-screen px-12">
        <div className="flex">
            <Navbar />
        </div>
        <div className="mt-4 flex gap-6">
            <div className="flex w-1/4 flex-col"><Sidebar /></div>
            <div className="flex w-3/4 flex-col">
                <Funds/>
                <Charities/>
            </div>
        </div>
    </div>
}

export default Homepage;