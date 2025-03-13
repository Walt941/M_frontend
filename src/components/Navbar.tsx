
import { useState } from 'react';
import {  FaUserPlus, FaAlignRight } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { useAuthStore } from '../stores/AuthStore';
import { Link } from 'react-router';


function Navbar() {
   
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const getUser = useAuthStore((state) => state.getUser);
   

    const [showMenu, setShowMenu] = useState(false);

    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-main-primary text-white">
            <div className="flex items-center">
                <Link to="/" className="text-2xl text-text-secondary font-bold">
                    Logo
                </Link>
            </div>

            <div className="flex items-center space-x-4">
               

                <div className="relative inline-block text-left">
                    <button
                        className="font-bold py-2 px-2 rounded"
                        id="options-menu"
                        aria-haspopup="true"
                        aria-expanded={showMenu}
                        onClick={handleToggleMenu}
                    >
                        <FaAlignRight size={24} color="currentColor" />
                    </button>

                    {showMenu && (
                        <div
                            className={`origin-top-right px-4 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1   ring-1 ring-black ring-opacity-5 focus:outline-none`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                        
                                    <Link to="/register" className={`flex items-center space-x-2 py-2 text-gray-700  hover:text-gray-900 px-1`} onClick={() => setShowMenu(false)}>
                                        <FaUserPlus size={24} color="currentColor" />
                                        <span>
                                            Register
                                        </span>
                                    </Link>
                                    <Link to="/login" className={`flex items-center space-x-2 py-2 text-gray-700  hover:text-gray-900 px-1`} onClick={() => setShowMenu(false)}>
                                        <IoIosLogIn size={24} color="currentColor" />
                                        <span>Login</span>
                                    </Link>
                           
                        </div>
                    )}
                </div>

            </div>
        </nav>
    )
}

export default Navbar