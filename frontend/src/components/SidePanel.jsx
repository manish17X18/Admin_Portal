import React, { useContext } from 'react';
import { MdLock, MdDashboardCustomize } from "react-icons/md";
import { HiMiniUsers } from "react-icons/hi2";
import { FaUserSecret, FaGlobe } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RealmContext } from '../components/RealmContext'; 

const SidePanel = () => {
    const navigate = useNavigate();
    const { realms, activeRealm, changeActiveRealm } = useContext(RealmContext);

    function logoutHandler() {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/signIn', { replace: true });
        toast.success('Logged out successfully!');
    }

    return (
        <aside className='fixed left-0 top-0 h-screen w-[20%] bg-[#0B132B] text-slate-300 p-6 flex flex-col justify-between border-r border-slate-800/50 z-40'>
            <div className='flex flex-col gap-6'>
                {/* Header Logo Section */}
                <div className='flex items-center gap-3 px-2 pt-2'>
                    <div className='p-2 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20'>
                        <MdLock size={22} />
                    </div>
                    <span className='text-lg font-bold text-white tracking-wide'>
                        Admin Portal
                    </span>
                </div>

                {/* 🌐 Realm Selector Dropdown */}
                <div className='flex flex-col gap-1.5 px-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800'>
                    <label className='text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5'>
                        <FaGlobe className='text-blue-500' /> Active Realm
                    </label>
                    <select
                        value={activeRealm}
                        onChange={(e) => changeActiveRealm(e.target.value)}
                        className='w-full bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                    >
                        {realms.map((r) => (
                            <option key={r.id || r.name} value={r.name}>
                                {r.name}
                            </option>
                        ))}
                    </select>
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

                    {/* Realms */}
                    <NavLink
                        to='/realms'
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <FaGlobe size={20} />
                        <span>Realms</span>
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