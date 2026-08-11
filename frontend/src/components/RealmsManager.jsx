// src/components/RealmsManager.jsx
import React, { useState, useContext } from 'react';
import { RealmContext } from '../components/RealmContext';
import { FaPlus, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from './Api';

const RealmsManager = () => {
    const { realms, activeRealm, changeActiveRealm, fetchRealms } = useContext(RealmContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRealmName, setNewRealmName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateRealm = async (e) => {
        e.preventDefault();
        if (!newRealmName.trim()) {
            toast.error("Realm name is required");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/api/v1/createRealm', {
                realmName: newRealmName.trim()
            });

            if (res.data?.success) {
                toast.success(`Realm '${newRealmName}' created!`);
                setNewRealmName('');
                setIsModalOpen(false);
                fetchRealms(); // Refresh realms list
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create realm");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen w-full flex justify-end bg-slate-50/50 p-8'>
            <div className='w-[80%] flex flex-col gap-6 pl-6'>
                {/* Header */}
                <div className='flex justify-between items-center'>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Realms Manager</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm cursor-pointer"
                    >
                        <FaPlus className="text-xs" />
                        <span>Create Realm</span>
                    </button>
                </div>

                {/* Realms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {realms.map((realm) => (
                        <div
                            key={realm.id || realm.name}
                            onClick={() => changeActiveRealm(realm.name)}
                            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                                activeRealm === realm.name
                                    ? 'border-blue-500 bg-blue-50/30 shadow-md ring-2 ring-blue-500/20'
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100/60 text-blue-600 rounded-xl">
                                        <FaGlobe size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{realm.name}</h3>
                                </div>
                                {activeRealm === realm.name && (
                                    <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-blue-600 text-white">
                                        Active
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                Status: {realm.enabled ? '🟢 Enabled' : '🔴 Disabled'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Realm Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-slate-900">Create New Realm</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
                        </div>
                        <form onSubmit={handleCreateRealm} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 uppercase">Realm Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. app-realm, testing-realm"
                                    value={newRealmName}
                                    onChange={(e) => setNewRealmName(e.target.value)}
                                    className="w-full px-3.5 py-2 mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl">
                                    {loading ? "Creating..." : "Save Realm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealmsManager;