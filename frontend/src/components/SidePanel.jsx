import React from 'react';
import { MdLock } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { HiMiniUsers } from "react-icons/hi2";
import { FaUserSecret } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const SidePanel = () => {
    const navigate = useNavigate();

    function logoutHandler() {
        // 1. Clear session storage items so ProtectedRoute kicks in
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');

        // 2. Clear default Authorization header from Axios
        delete axios.defaults.headers.common['Authorization'];

        // 3. Redirect to login page and replace browser history entry
        navigate('/signIn', { replace: true });

        // 4. Toast notification
        toast.success('Logged out successfully!', {
            position: 'top-right',
            autoClose: 3000
        });
    }

    return (
        <aside className='fixed left-0 top-0 h-screen w-[20%] bg-[#0B132B] text-slate-300 p-6 flex flex-col justify-between border-r border-slate-800/50 z-40'>
            <div className='flex flex-col gap-8'>
                {/* Header Logo Section */}
                <div className='flex items-center gap-3 px-2 pt-2'>
                    <div className='p-2 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20'>
                        <MdLock size={22} />
                    </div>
                    <span className='text-lg font-bold text-white tracking-wide'>
                        Admin Portal
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className='flex flex-col gap-2'>
                    {/* Dashboard */}
                    <NavLink
                        to='/dashboard'
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <MdDashboardCustomize size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* Users */}
                    <NavLink
                        to='/users'
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <HiMiniUsers size={20} />
                        <span>Users</span>
                    </NavLink>

                    {/* Admins */}
                    <NavLink
                        to='/admins'
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <FaUserSecret size={20} />
                        <span>Admins</span>
                    </NavLink>

                    {/* Roles */}
                    <NavLink
                        to='/roles'
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <GoProjectRoadmap size={20} />
                        <span>Roles</span>
                    </NavLink>
                </nav>
            </div>

            {/* Logout Button Pinned to Bottom */}
            <div className='pt-6 border-t border-slate-800/60'>
                <button
                    onClick={logoutHandler}
                    className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer'
                >
                    <IoIosLogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SidePanel;