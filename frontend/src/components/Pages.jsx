import React from 'react'
import SignIn from './SignIn'
import Users from './Users'
import Admins from './Admins'
import SidePanel from './SidePanel'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './Dashboard'
import Role from './Role'
import ProtectedRoute from './ProtectedRoute'

const Pages = () => {
  const location = useLocation();
  const noSidePanel = ['/signIn', '/signin', '/'];
  const showSidePanel = !noSidePanel.includes(location.pathname);

  return (
    <div className="flex">
      {showSidePanel && <SidePanel />}
      
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/signIn" replace />} />
          <Route path="/signIn" element={<SignIn />} />

          {/* Protected Routes: Blocks unauthenticated users from URL tampering */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/roles" element={<Role />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/signIn" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pages