import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MdDelete, MdOutlineModeEditOutline } from "react-icons/md";
import axios from 'axios';
import { RealmContext } from '../components/RealmContext';
import { useContext } from 'react';
import api from './Api';

const Users = () => {
    const { activeRealm } = useContext(RealmContext);
    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [rolesList, setRolesList] = useState([]); // All Keycloak Roles
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState('All');

    // Store selected user object for editing (null when not editing)
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    function changeHandler(e) {
        setName(e.target.value);
    }

    function roleHandler(e) {
        setSelectedRole(e.target.value);
    }

    function addUser() {
        setEditingUser(null);
        setIsOpen(true);
    }

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm();

    function closeFile() {
        setIsOpen(false);
        setEditingUser(null);
        reset();
    }

    // Effect to handle form reset/pre-filling when modal opens or editing state changes
    useEffect(() => {
        if (editingUser) {
            reset({
                name: editingUser.name || '',
                email: editingUser.email || '',
                phNo: editingUser.phoneNumber || editingUser.phNo || '',
                role: editingUser.role || ''
            });
        } else {
            reset({
                name: '',
                email: '',
                phNo: '',
                role: ''
            });
        }
    }, [editingUser, reset]);

    // 1. Fetch Users from Backend
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/v1/getusers?realm=${activeRealm}`);
            if (response.data?.success) {
                setUserList(response.data.users);
            }
        } catch (error) {
            console.error("API Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Keycloak Roles for Dropdown Selection
    const fetchRoles = async () => {
        try {
            const response = await api.get(`/api/v1/getRoles?realm=${activeRealm}`);
            if (response.data?.success) {
                setRolesList(response.data.roles);
            }
        } catch (error) {
            console.error("API Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // 3. Submit New User Handler (POST)
    async function submitHandler(data) {
        try {
            const response = await api.post(`/api/v1/createUser?realm=${activeRealm}`, data);
            if (response.data?.success) {
                toast.success(response.data.message || "User created successfully!");
                closeFile();
                fetchUsers();
            }
        } catch (error) {
            console.error("API Error creating user:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to add user";

            toast.error(errorMessage);
        }
    }

    // 4. Submit Edit User Handler (PUT / PATCH)
    async function editSubmitHandler(data) {
        if (!editingUser?.id) return;

        try {
            const response = await api.put(`/api/v1/editUser?realm=${activeRealm}`, {
                id: editingUser.id,
                phNo: data.phNo,
                role: data.role
            });

            if (response.data?.success) {
                toast.success(response.data.message || "User updated successfully!");
                closeFile();
                fetchUsers();
            }
        } catch (error) {
            console.error("API Error updating user:", error);
            const errorMessage =
                error.message

            toast.error(errorMessage);
        }
    }

    // 5. Combined Filter: Text Search (Name/Email) + Role Dropdown
    const filteredUsers = userList.filter((user) => {
        const matchesNameOrEmail =
            (user.name && user.name.toLowerCase().includes(name.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(name.toLowerCase()));

        const matchesRole =
            selectedRole === 'All' ||
            (user.role && user.role.split(', ').includes(selectedRole));

        return matchesNameOrEmail && matchesRole;
    });

    // 6. Delete User Handler
    const deleteHandler = async (userId, userName) => {
        if (!userId) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete ${userName || 'this user'}?`);
        if (!confirmDelete) return;

        try {
            const response = await api.delete(`/api/v1/deleteUser?realm=${activeRealm}`, {
                data: { id: userId }
            });

            if (response.data?.success) {
                toast.success(response.data.message || "User deleted successfully!");
                setUserList((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            }
        } catch (error) {
            console.error("API Error deleting user:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete user";

            toast.error(errorMessage);
        }
    };

    const editHandler = (user) => {
        if (!user) return;
        setEditingUser(user); // Opens modal and populates form inputs
    };

    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-8'>
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

                {/* Add User Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Add User</h2>
                                <button onClick={closeFile} className="text-slate-400 hover:text-slate-600 font-bold">
                                    ✕
                                </button>
                            </div>

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

                                    {/* Phone Number Input */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Phone No</label>
                                        <input
                                            type="number"
                                            {...register('phNo', {
                                                required: "Phone number is required",
                                                minLength: { value: 10, message: "Enter Valid Phone Number" },
                                                maxLength: { value: 10, message: "Enter Valid Phone Number" }
                                            })}
                                            placeholder="Enter Phone No"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.phNo && <p className="text-xs text-red-500">{errors.phNo.message}</p>}
                                    </div>

                                    {/* Role Dropdown Select */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Role</label>
                                        <select
                                            {...register('role', {
                                                required: "Role is required"
                                            })}
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                        >
                                            <option value="">Select Role</option>
                                            {rolesList.map((role) => (
                                                <option key={role.id || role.name} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
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
                                        {isSubmitting ? "Saving..." : "Save User"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {Boolean(editingUser) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
                                <button onClick={closeFile} className="text-slate-400 hover:text-slate-600 font-bold">
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(editSubmitHandler)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* read only */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <input
                                            {...register('name')}
                                            readOnly
                                            className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-sm cursor-not-allowed"
                                        />
                                    </div>

                                    {/* read only */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            {...register('email')}
                                            readOnly
                                            className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-sm cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Phone Number Input  */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Phone No</label>
                                        <input
                                            type="number"
                                            {...register('phNo', {
                                                required: "Phone number is required",
                                                minLength: { value: 10, message: "Enter Valid Phone Number" },
                                                maxLength: { value: 10, message: "Enter Valid Phone Number" }
                                            })}
                                            placeholder="Enter Phone No"
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        {errors.phNo && <p className="text-xs text-red-500">{errors.phNo.message}</p>}
                                    </div>

                                    {/* Role Dropdown Select */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-700">Role</label>
                                        <select
                                            {...register('role', {
                                                required: "Role is required"
                                            })}
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                        >
                                            <option value="">Select Role</option>
                                            {rolesList.map((role) => (
                                                <option key={role.id || role.name} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
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
                                        {isSubmitting ? "Updating..." : "Update User"}
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

                        {/* Dropdown Select for Keycloak Roles */}
                        <select
                            value={selectedRole}
                            onChange={roleHandler}
                            className='bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer'
                        >
                            <option value="All">All Roles</option>
                            {rolesList.map((role) => (
                                <option key={role.id || role.name} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden'>
                    {loading ? (
                        <div className='p-8 text-center text-slate-500 font-medium'>
                            Loading users from Keycloak...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className='p-8 text-center text-slate-500 font-medium'>
                            No users found.
                        </div>
                    ) : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                    <th className='py-4 px-6'>Name / Username</th>
                                    <th className='py-4 px-6'>Email</th>
                                    <th className='py-4 px-6'>Phone Number</th>
                                    <th className='py-4 px-6'>Role</th>
                                    <th className='py-4 px-6 text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100 text-sm text-slate-700'>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className='hover:bg-slate-50/80 transition-colors'>
                                        <td className='py-4 px-6 font-medium text-slate-900'>{user.name}</td>
                                        <td className='py-4 px-6 text-slate-600'>{user.email}</td>
                                        <td className='py-4 px-6 text-slate-600'>{user.phoneNumber || user.phNo || 'N/A'}</td>
                                        <td className='py-4 px-6'>
                                            <span className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 uppercase tracking-wider'>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6 text-center space-x-3'>
                                            <button
                                                onClick={() => editHandler(user)}
                                                className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                title="Edit User"
                                            >
                                                <MdOutlineModeEditOutline size={20} className="inline" />
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(user.id, user.name)}
                                                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                title="Delete User"
                                            >
                                                <MdDelete size={20} className="inline" />
                                            </button>
                                        </td>
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

export default Users;