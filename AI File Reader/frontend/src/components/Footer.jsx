import React from 'react'
import { assets } from "../assets/assets";

export default function Footer() {

    const year = new Date().getFullYear();

    return (
        <footer className="w-full text-white mt-5">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <img className="h-11 transform scale-170"
                        src={assets.image} alt="image"/>
                </div>
                <p className="text-center max-w-xl text-md  font-normal leading-relaxed p-3">
                    Empowering users to extract, understand, and interact with content from files using advanced AI.
      Seamlessly turn complex documents into actionable insights.
                </p>
            </div>
            <div className="border-t border-[#3B1A7A]">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <a href="#">Questrion</a> ©{year}. All rights reserved.
                </div>
            </div>
        </footer>
    );
};