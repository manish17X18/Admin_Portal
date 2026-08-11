import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { RealmContext } from '../components/RealmContext';
import { useContext } from 'react';
import api from './Api';
const RolesManager = () => {
    const { activeRealm } = useContext(RealmContext);

    // 1. Search Query Sync with URL
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    // 2. Internal Component States
    const [rolesList, setRolesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Input States
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');

    // Handle typing in search input
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (query) next.set('search', query);
            else next.delete('search');
            return next;
        });
    };

    // 3. Fetch Roles directly inside this component
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/v1/getRoles?realm=${activeRealm}`);
            if (response.data?.success) {
                setRolesList(response.data.roles);
            }
        } catch (error) {
            console.error("Failed to load roles", error);
            toast.error("Failed to load roles from server");
        } finally {
            setLoading(false);
        }
    };

    // Run fetch on component mount
    useEffect(() => {
        fetchRoles();
    }, []); 

    // Filter roles based on searchQuery
    const filteredRoles = rolesList.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 4. Submit New Role Handler
    const handleAddRoleSubmit = async (e) => {
        e.preventDefault();

        if (!roleName.trim()) {
            toast.error("Role name is required!");
            return;
        }

        const newRoleData = {
            role: roleName.trim(),
            description: roleDescription.trim()
        };

        try {
            // Optional: Connect your backend POST endpoint here once ready
            const res = await api.post(`/api/v1/addRole?realm=${activeRealm}`, newRoleData);

            toast.success(`Role '${roleName}' created successfully`);

            // Reset Form & Close Modal
            setRoleName('');
            setRoleDescription('');
            setIsModalOpen(false);

            // Refresh the roles list automatically
            fetchRoles();
        } catch (error) {
            console.error("Error creating role:", error);
            toast.error(error.response?.data?.message || "Failed to create role");
        }
    };

    async function deleteHandler( roleId,roleName ) {
        if (!roleId || !roleName) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete the role '${roleName}'?`);
        if (!confirmDelete) return;
        try {
            const response = await api.delete(`/api/v1/deleteRole?realm=${activeRealm}`, {
                data: {
                        roleName:roleName,
                        id: roleId 
                    }
            })
            if (response.data?.success) {
                toast.success(`${roleName} has been deleted`)
                setRolesList((prevRoles) => prevRoles.filter((role) => role.id !== roleId))
                fetchRoles(); // Refresh the roles list after deletion
            }
        } catch (error) {
            console.error("API Error deleting role:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete role";

            toast.error(errorMessage);
        }
    }
    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-8'>
            <div className='w-[80%] flex flex-col gap-6 pl-6'>

                {/* Header Section */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Roles
                        </h1>
                        <div className='flex items-center gap-1.5 text-sm font-medium text-slate-500'>
                            <span>Dashboard</span>
                            <IoIosArrowForward className='text-xs text-slate-400' />
                            <span className='text-slate-700'>Roles</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2.5 px-5 rounded-xl shadow-sm shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                    >
                        <FaPlus className="text-xs" />
                        <span>Add Role</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className='bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col gap-6'>
                    {/* Search Input Box */}
                    <div className='relative max-w-md flex items-center'>
                        <CiSearch className='absolute left-3.5 text-slate-400 text-xl pointer-events-none' />
                        <input
                            type='text'
                            placeholder='Search roles...'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                        />
                    </div>

                    {/* Dynamic Roles Grid: Loading State vs Empty Search vs Grid */}
                    {loading ? (
                        <div className="py-12 text-center text-slate-500 text-sm">
                            Loading roles from Keycloak...
                        </div>
                    ) : filteredRoles.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-200 rounded-xl">
                            {searchQuery ? `No roles found matching "${searchQuery}"` : "No roles available yet."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredRoles.map((role, idx) => (
                                <div key={role.id || idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-blue-100/80 text-blue-700 tracking-wider">
                                            {role.name}
                                        </span>
                                    </div>
                                    <p className=" text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                        {role.description || 'No description provided'}
                                    </p>
                                    <div>
                                        <MdDelete onClick={() => deleteHandler(role.id,role.name)} size={20} className='inline hover:cursor-pointer hover:text-red-500' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Create Role Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-slate-900">Create New Role</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors font-bold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddRoleSubmit} className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Role Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Teacher, Manager, Auditor"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Brief description of permissions given to this role..."
                                    value={roleDescription}
                                    onChange={(e) => setRoleDescription(e.target.value)}
                                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors cursor-pointer"
                                >
                                    Save Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesManager;