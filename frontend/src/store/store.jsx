import {configureStore} from '@reduxjs/toolkit'
import SignIn from '../features/Signin'

export const store=configureStore({
    reducer:{
        signin:SignIn,
    }
})