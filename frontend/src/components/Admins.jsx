import React from 'react'
import { FaPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';

const Admins = () => {
    //filter the admins
    //connect with backend
    //create a form of add admin
    const [name, setName] = useState('')

    function changeHandler(e) {
        setName(e.target.value)
        console.log(name)
    }

    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-8'>
            {/* Reserved space on the left (20%) for your sidebar */}
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

                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2.5 px-5 rounded-xl shadow-sm shadow-blue-500/20 active:scale-[0.98]">
                        <FaPlus className="text-xs" />
                        <span>Add Admin</span>
                    </button>
                </div>

                {/* Filter Card Container */}
                <div className='bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50'>
                    <div className='flex items-center gap-4'>
                        {/* Search Input Box */}
                        <div className='relative flex-1 max-w-md flex items-center'>
                            <CiSearch className='absolute left-3.5 text-slate-400 text-xl pointer-events-none' />
                            <input
                                type='text'
                                placeholder='Search Admins...'
                                value={name}
                                onChange={changeHandler}
                                className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admins