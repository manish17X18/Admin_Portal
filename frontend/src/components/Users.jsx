import React from 'react'
import { FaPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form'; // Removed invalid submitHandler import
import { toast } from 'react-toastify';

const Users = () => {
    const [name, setName] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    function changeHandler(e) {
        setName(e.target.value)
        console.log(name)
    }

    function roleHandler(e) {
        console.log(e.target.value)
    }

    function addUser() {
        setIsOpen(true)
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    function closeFile(){
        setIsOpen(false);
        reset()
    }
    async function submitHandler(data) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(data);
        toast.success("User Added");
        reset(); // Clear form state
        setIsOpen(false); // Close modal
    }

    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-8'>
            {/* Reserved space on the left (20%) for your sidebar */}
            <div className='w-[80%] flex flex-col gap-6 pl-6'>
                {/* Header Section */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Users
                        </h1>
                        <div className='flex items-center gap-1.5 text-sm font-medium text-slate-500'>
                            <span>Admins</span>
                            <IoIosArrowForward className='text-xs text-slate-400' />
                            <span className='text-slate-700'>Users</span>
                        </div>
                    </div>

                    <button onClick={addUser} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2.5 px-5 rounded-xl shadow-sm shadow-blue-500/20 active:scale-[0.98]">
                        <FaPlus className="text-xs" />
                        <span>Add User</span>
                    </button>
                </div>

                {/* Modal Overlay */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl border border-slate-100">

                            {/* Header (Title + 'X' button) */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Add User</h2>
                                <button onClick={closeFile} className="text-slate-400 hover:text-slate-600 font-bold">
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Name Input */}
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

                                    {/* Email Input */}
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

                                    {/* Password Input */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Phone No</label>
                                        <input
                                            type="number"
                                            {...register('phNo', {
                                                required: "phNo is required",
                                                minLength:{value:10,message:"Enter Valid Phone Number"},
                                                maxLength:{value:10,message:"Enter Valid Phone Number"}
                                            })}
                                            placeholder="Enter Phone No"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.phNo && <p className="text-xs text-red-500">{errors.phNo.message}</p>}
                                    </div>

                                    {/* Role Input */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Role</label>
                                        <input
                                            {...register('role', {
                                                required: "Role is required"
                                            })}
                                            placeholder="Enter role"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                                    </div>
                                </div>

                                {/* Footer Buttons Inside Form */}
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
                                        {isSubmitting ? "Saving..." : "Save User"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Filter Card Container */}
                <div className='bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50'>
                    <div className='flex items-center gap-4'>
                        {/* Search Input Box */}
                        <div className='relative flex-1 max-w-md flex items-center'>
                            <CiSearch className='absolute left-3.5 text-slate-400 text-xl pointer-events-none' />
                            <input
                                type='text'
                                placeholder='Search Users...'
                                value={name}
                                onChange={changeHandler}
                                className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                            />
                        </div>

                        {/* Dropdown Select */}
                        <select
                            onChange={roleHandler}
                            className='bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer'
                        >
                            <option value="All">All Roles</option>
                            <option value="software">Software</option>
                            <option value="hardware">Hardware</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users