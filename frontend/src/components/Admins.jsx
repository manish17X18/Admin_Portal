import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

const Admins = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [adminList, setAdminList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    function searchChangeHandler(e) {
        setSearchTerm(e.target.value);
    }

    function addAdmin() {
        setIsOpen(true);
    }

    function closeFile() {
        setIsOpen(false);
        reset();
    }

    // 1. Fetch Admins from Backend
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/v1/getAdmins?realm=master');
            if (response.data?.success) {
                setAdminList(response.data.admins || response.data.users || []);
            }
        } catch (error) {
            console.error("API Error fetching admins:", error);
            toast.error("Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // 2. Submit New Admin Handler (Sends password along with user details)
    async function submitHandler(data) {
        try {
            const adminPayload = {
                ...data,
                role: 'admin'
            };

            const response = await axios.post('http://localhost:5000/api/v1/createAdmin?realm=master', adminPayload);
            
            if (response.data?.success) {
                toast.success(response.data.message || "Admin added successfully!");
                closeFile();
                fetchAdmins();
            }
        } catch (error) {
            console.error("API Error creating admin:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to add admin";

            toast.error(errorMessage);
        }
    }

    // 3. Filter Admins strictly by Name / Email
    const filteredAdmins = adminList.filter((admin) => {
        const query = searchTerm.toLowerCase();
        const matchesName = admin.name && admin.name.toLowerCase().includes(query);
        const matchesEmail = admin.email && admin.email.toLowerCase().includes(query);

        return matchesName || matchesEmail;
    });

    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-8'>
            <div className='w-[80%] flex flex-col gap-6 pl-6'>
                {/* Header Section */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Admins
                        </h1>
                        <div className='flex items-center gap-1.5 text-sm font-medium text-slate-500'>
                            <span>Dashboard</span>
                            <IoIosArrowForward className='text-xs text-slate-400' />
                            <span className='text-slate-700'>Admins</span>
                        </div>
                    </div>

                    <button 
                        onClick={addAdmin} 
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2.5 px-5 rounded-xl shadow-sm shadow-blue-500/20 active:scale-[0.98]"
                    >
                        <FaPlus className="text-xs" />
                        <span>Add Admin</span>
                    </button>
                </div>

                {/* Add Admin Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl border border-slate-100">

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Add Admin</h2>
                                <button 
                                    onClick={closeFile} 
                                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <input
                                            {...register('name', {
                                                required: "Name is required",
                                                minLength: { value: 3, message: "Min Length is 3" },
                                                maxLength: { value: 20, message: "Max Length is 20" },
                                            })}
                                            placeholder="Enter full name"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            {...register('email', {
                                                required: "Email is required"
                                            })}
                                            placeholder="Enter email address"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Phone No</label>
                                        <input
                                            type="tel"
                                            {...register('phNo', {
                                                required: "Phone number is required",
                                                minLength: { value: 10, message: "Enter a valid 10-digit phone number" },
                                                maxLength: { value: 10, message: "Enter a valid 10-digit phone number" },
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Only digits are allowed"
                                                }
                                            })}
                                            placeholder="Enter Phone No"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.phNo && <p className="text-xs text-red-500">{errors.phNo.message}</p>}
                                    </div>

                                    {/* Password Input */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                        <input
                                            type="password"
                                            {...register('password', {
                                                required: "Password is required",
                                                minLength: { value: 6, message: "Minimum password length is 6 characters" }
                                            })}
                                            placeholder="Enter Password"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                                    </div>

                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={closeFile}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Admin"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Filter Box Container */}
                <div className='bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50'>
                    <div className='flex items-center gap-4'>
                        <div className='relative flex-1 max-w-md flex items-center'>
                            <CiSearch className='absolute left-3.5 text-slate-400 text-xl pointer-events-none' />
                            <input
                                type='text'
                                placeholder='Search Admins by name or email...'
                                value={searchTerm}
                                onChange={searchChangeHandler}
                                className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/* Admins Table */}
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden'>
                    {loading ? (
                        <div className='p-8 text-center text-slate-500 font-medium'>
                            Loading administrators from Keycloak...
                        </div>
                    ) : filteredAdmins.length === 0 ? (
                        <div className='p-8 text-center text-slate-500 font-medium'>
                            No administrators found.
                        </div>
                    ) : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                    <th className='py-4 px-6'>Name</th>
                                    <th className='py-4 px-6'>Email</th>
                                    <th className='py-4 px-6'>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100 text-sm text-slate-700'>
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className='hover:bg-slate-50/80 transition-colors'>
                                        <td className='py-4 px-6 font-medium text-slate-900'>{admin.name}</td>
                                        <td className='py-4 px-6 text-slate-600'>{admin.email}</td>
                                        <td className='py-4 px-6 text-slate-600'>{admin.phoneNumber || admin.phNo || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Admins;