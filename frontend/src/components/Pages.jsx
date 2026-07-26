import React from 'react'
import SignIn from './SignIn'
import Users from './Users'
import Admins from './Admins'
import { Navigate, NavLink,Route,Routes } from 'react-router'
const Pages = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigate to="/signIn" replace/>}/>
        <Route path="/signIn" element={<SignIn/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/admins" element={<Admins/>}/>
      </Routes>
    </div>
  )
}

export default Pages
