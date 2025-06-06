import { useState } from 'react';
import { FaUserPlus, FaAlignRight, FaSignOutAlt } from "react-icons/fa";
import { IoIosLogIn, IoMdHome } from "react-icons/io";
import { FcStatistics } from "react-icons/fc";
import { Link } from 'react-router'; // Corregí la importación de Link
import { useAuthStore } from '../stores/authStore';

function Navbar() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [showMenu, setShowMenu] = useState(false);

    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        logout(); 
        setShowMenu(false); 
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-main-primary text-white">
            <div className="flex items-center">
                <Link to="/" className="text-2xl text-text-secondary font-bold">
                    MT
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
                            className={`origin-top-right px-4 absolute right-0 mt-4 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            <Link
                                to="/home"
                                className={`flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 px-1`}
                                onClick={() => setShowMenu(false)}
                            >
                                <IoMdHome size={24} color="currentColor" />
                                <span>Home</span>
                            </Link>

                            {!isAuthenticated ? (
                                <>
                                
                                    <Link
                                        to="/register"
                                        className={`flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 px-1`}
                                        onClick={() => setShowMenu(false)}
                                    >
                                        <FaUserPlus size={24} color="currentColor" />
                                        <span>Registro</span>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className={`flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 px-1`}
                                        onClick={() => setShowMenu(false)}
                                    >
                                        <IoIosLogIn size={24} color="currentColor" />
                                        <span>Login</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/progress"
                                        className={`flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 px-1`}
                                        onClick={() => setShowMenu(false)}
                                    >
                                        <FcStatistics size={24} color="currentColor" />
                                        <span>Progreso</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 px-1 w-full`}
                                    >
                                        <FaSignOutAlt size={24} color="currentColor" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;