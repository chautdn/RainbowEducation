import React from 'react';
import { NavLink } from 'react-router-dom';
import { navlinks } from '../../utils/navlinks';

const Header = () => {
    return (
        <header className="bg-blue-500 p-4 text-white relative shadow-xl">
            <div className="container mx-auto flex justify-between sticky top-0">
                <h1 className="text-2xl font-bold">Fun Math Games</h1>
                <nav className='space-x-4'>
                    <div className="hidden md:block">
                        <ul className="flex gap-5 sm:justify-between dsm:items-center">
                            {navlinks.map((link) => (
                                <div className="relative group" key={link.name}>
                                    <NavLink
                                        to={link.address}
                                        className={`text-2xl font-extrabold transition-all duration-300`}
                                    >
                                        {link.name}
                                    </NavLink>

                                </div>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;



