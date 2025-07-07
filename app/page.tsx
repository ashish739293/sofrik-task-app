"use client";

import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { FaProjectDiagram } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-4">
          <FaProjectDiagram className="text-yellow-400 text-5xl animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Welcome to{" "}
          <span className="text-yellow-400">Project Manager</span>
        </h1>

        <h2 className="text-xl md:text-2xl text-gray-200 mb-6">
          <Typewriter
            words={[
              "Organize your work efficiently",
              "Track progress with ease",
              "Stay focused and productive",
              "Collaborate with your team",
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </h2>

        <p className="text-gray-300 mb-8 text-sm md:text-base">
          Your all-in-one solution for managing projects and tasks — intuitive,
          fast, and beautifully designed.
        </p>

        <div className="flex justify-center gap-6">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-white hover:bg-white hover:text-black text-white px-6 py-3 rounded-full font-semibold transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
