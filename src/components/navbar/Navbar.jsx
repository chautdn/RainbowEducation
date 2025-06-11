import PropTypes from "prop-types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center justify-center overflow-hidden">
            <img
              src="../../../public/img/Icon.png"
              alt="Logo"
              className=" object-contain"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <DropdownMenu title="Parents" />
          <DropdownMenu title="Educators" />
          <DropdownMenu title="Our Library" />
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="px-5 py-2 border border-indigo-900 text-indigo-900 rounded-full hover:bg-gray-50 transition-colors text-center"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors text-center"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
            <MobileDropdownMenu title="Parents" />
            <MobileDropdownMenu title="Educators" />
            <MobileDropdownMenu title="Our Library" />

            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              <button className="px-5 py-2 border border-indigo-900 text-indigo-900 rounded-full hover:bg-gray-50 transition-colors">
                Log in
              </button>
              <button className="px-5 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Dropdown Menu Component
const DropdownMenu = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center space-x-1 text-gray-800 hover:text-indigo-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-2">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Option 1
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Option 2
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Option 3
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Dropdown Menu Component
const MobileDropdownMenu = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full py-2 text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-4 mt-2 border-l-2 border-gray-200">
          <a href="#" className="block py-2 text-sm text-gray-700">
            Option 1
          </a>
          <a href="#" className="block py-2 text-sm text-gray-700">
            Option 2
          </a>
          <a href="#" className="block py-2 text-sm text-gray-700">
            Option 3
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
DropdownMenu.propTypes = {
  title: PropTypes.string.isRequired,
};

MobileDropdownMenu.propTypes = {
  title: PropTypes.string.isRequired,
};
