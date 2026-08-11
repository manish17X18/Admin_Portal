import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from './api';

export const RealmContext = createContext();

export const RealmProvider = ({ children }) => {
    const [realms, setRealms] = useState([]);
    const [activeRealm, setActiveRealm] = useState(() => {
        return localStorage.getItem('activeRealm') || 'master';
    });

    const fetchRealms = async () => {
        try {
            const res = await api.get('/api/v1/getRealm');
            if (res.data?.success) {
                setRealms(res.data.realms);
            }
        } catch (err) {
            console.error("Failed to fetch realms", err);
        }
    };

    useEffect(() => {
        fetchRealms();
    }, []);

    const changeActiveRealm = (realmName) => {
        setActiveRealm(realmName);
        localStorage.setItem('activeRealm', realmName);
    };

    return (
        <RealmContext.Provider value={{ realms, setRealms, activeRealm, changeActiveRealm, fetchRealms }}>
            {children}
        </RealmContext.Provider>
    );
};