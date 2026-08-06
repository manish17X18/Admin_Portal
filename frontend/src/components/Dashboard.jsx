import React, { useState, useEffect } from 'react';
import { FiBell, FiUsers, FiUserCheck, FiShield, FiActivity } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { RealmContext } from '../components/RealmContext';
import { useContext } from 'react';
const ROLE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

const Dashboard = () => {
    const { activeRealm } = useContext(RealmContext);
    const [timeframe, setTimeframe] = useState('Last 7 days');
    const [loading, setLoading] = useState(true);

    // 💡 Read logged-in user details from localStorage
    const [loggedInUser, setLoggedInUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('adminUser');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Extract dynamic display name and role (Fallback to 'Admin' if not found)
    const displayName = loggedInUser?.name || loggedInUser?.username || 'Admin';
    const displayRole = loggedInUser?.role ? loggedInUser.role.toUpperCase() : 'ADMIN';

    // Live Metrics State
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalRoles: 0,
        activeSessions: 0,
    });
    const [roleData, setRoleData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/v1/dashboardStats?realm=${activeRealm}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data?.success) {
                    setMetrics(response.data.stats);

                    const coloredRoleData = response.data.roleData.map((item, index) => ({
                        ...item,
                        color: ROLE_COLORS[index % ROLE_COLORS.length]
                    }));

                    setRoleData(coloredRoleData);
                }
            } catch (error) {
                console.error("Error fetching dashboard metrics:", error);
                toast.error("Failed to load live dashboard stats");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        {
            title: 'Total Users',
            value: metrics.totalUsers,
            icon: <FiUsers />,
            bgColor: 'bg-blue-600',
            shadowColor: 'shadow-blue-500/20',
        },
        {
            title: 'Total Admins',
            value: metrics.totalAdmins,
            icon: <FiUserCheck />,
            bgColor: 'bg-emerald-500',
            shadowColor: 'shadow-emerald-500/20',
        },
        {
            title: 'Total Roles',
            value: metrics.totalRoles,
            icon: <FiShield />,
            bgColor: 'bg-indigo-500',
            shadowColor: 'shadow-indigo-500/20',
        },
        {
            title: 'Active Sessions',
            value: metrics.activeSessions,
            icon: <FiActivity />,
            bgColor: 'bg-amber-500',
            shadowColor: 'shadow-amber-500/20',
        },
    ];

    if (loading) {
        return (
            <div className='min-h-screen w-full flex justify-center items-center bg-slate-50/50'>
                <span className='text-slate-500 font-semibold text-lg animate-pulse'>
                    Loading Live Keycloak Metrics...
                </span>
            </div>
        );
    }

    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-6'>
            <div className='w-[80%] flex flex-col gap-6 pl-6'>

                {/* Top Header Navbar */}
                <div className='flex justify-between items-center w-full'>
                    <div></div>

                    <div className='flex items-center gap-4'>
                        <button className='relative text-slate-500 hover:text-slate-700 text-lg p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer'>
                            <FiBell />
                            <span className='absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full'></span>
                        </button>

                        {/* 💡 Dynamic Logged-In User Profile */}
                        <div className='flex items-center gap-2.5 cursor-pointer group'>
                            <div className='w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200'>
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                                    alt="User Avatar"
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='flex flex-col text-left'>
                                <span className='text-xs font-semibold text-slate-900 leading-tight capitalize'>
                                    {displayName}
                                </span>
                                <span className='text-[10px] text-slate-500 capitalize'>
                                    {displayRole}
                                </span>
                            </div>
                            <IoChevronDown className='text-slate-400 text-xs group-hover:text-slate-600 transition-colors ml-0.5' />
                        </div>
                    </div>
                </div>

                {/* Dashboard Title & Welcome Banner */}
                <div className='flex flex-col gap-0.5'>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className='text-xs text-slate-500 font-medium capitalize'>
                        Welcome back, {displayName} 👋
                    </p>
                </div>

                {/* Metric Cards Grid */}
                <div className='grid grid-cols-4 gap-4'>
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className='bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center gap-4'
                        >
                            <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center text-white text-xl shadow-md ${item.shadowColor} shrink-0`}>
                                {item.icon}
                            </div>
                            <div className='flex flex-col gap-0.5'>
                                <span className='text-xs font-medium text-slate-500'>
                                    {item.title}
                                </span>
                                <span className='text-2xl font-bold text-slate-900 tracking-tight'>
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Donut Chart with Live Role Breakdown */}
                <div className='grid grid-cols-12 gap-6'>
                    <div className='col-span-12 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between'>
                        <h2 className='text-base font-bold text-slate-900 mb-4'>Users by Role (Live)</h2>

                        <div className='flex items-center justify-start gap-12 h-full'>
                            <div className='w-64 h-52 relative flex items-center justify-center'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={roleData}
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="count"
                                        >
                                            {roleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className='flex flex-col gap-3 pr-2 w-72'>
                                {roleData.map((item, index) => (
                                    <div key={index} className='flex items-center justify-between text-xs'>
                                        <div className='flex items-center gap-2'>
                                            <span 
                                                className='w-2.5 h-2.5 rounded-full shrink-0' 
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className='font-medium text-slate-700 capitalize'>{item.name}</span>
                                        </div>
                                        <span className='font-semibold text-slate-500'>
                                            {item.count} ({item.percentage})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;