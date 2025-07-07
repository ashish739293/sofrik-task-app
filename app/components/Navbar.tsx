"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import Cookies from "js-cookie";
import { logout } from "../store/commonSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaTachometerAlt,
  FaProjectDiagram,
} from "react-icons/fa";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxToken = useSelector((state: RootState) => state.common.token);
  const [cookieToken, setCookieToken] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch token from cookie only on client
  useEffect(() => {
    const token = Cookies.get("token");
    setCookieToken(token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");          // 🧽 Remove token from cookies
    dispatch(logout());   // 🧼 Clear from Redux
    setCookieToken(undefined)            
    router.push("/login");            // 🔁 Redirect
  };

  const isLoggedIn = cookieToken || reduxToken;

  return (
    <nav className="bg-[#1f2937] shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-2xl font-bold flex items-center gap-2"
        >
          <FaProjectDiagram className="text-yellow-400" />
          <span>ProjectManager</span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#1f2937] md:bg-transparent md:mt-0 mt-3 px-4 py-3 md:p-0 rounded md:rounded-none`}
        >
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block py-2 md:py-0 text-white hover:text-yellow-400 flex items-center gap-2"
              >
                <FaTachometerAlt /> Projects
              </Link>

              <button
                onClick={handleLogout}
                className="mt-2 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block py-2 md:py-0 text-white hover:text-yellow-400 flex items-center gap-2"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                href="/register"
                className="block py-2 md:py-0 text-white hover:text-yellow-400 flex items-center gap-2"
              >
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
