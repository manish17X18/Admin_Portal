import React from 'react';
import SignIn from './SignIn';
import Users from './Users';
import Admins from './Admins';
import SidePanel from './SidePanel';
import RealmsManager from './RealmsManager';
import { RealmProvider } from '../components/RealmContext';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Role from './Role';
import ProtectedRoute from './ProtectedRoute';

const Pages = () => {
  const location = useLocation();
  const noSidePanel = ['/signIn', '/signin', '/'];
  const showSidePanel = !noSidePanel.includes(location.pathname);

  return (
    <RealmProvider>
      <div className="flex">
        {showSidePanel && <SidePanel />}

        <div className="flex-1">
          <Routes>

            {/* Public route */}
            <Route path="/signIn" element={<SignIn />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/realms" element={<RealmsManager />} />
              <Route path="/users" element={<Users />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/roles" element={<Role />} />
            </Route>

            {/* Root */}
            <Route path="/" element={<Navigate to="/signIn" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/signIn" replace />} />

          </Routes>
        </div>
      </div>
    </RealmProvider>
  );
};

export default Pages;