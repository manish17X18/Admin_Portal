import { createSlice } from "@reduxjs/toolkit";


export const SignIn=createSlice({
    name:"admins",
    initialState:{
        isLoggedIn:false
    },
    reducers:{
        login:(state)=>{
            state.isLoggedIn=true
        },
        logout:(state)=>{
            state.isLoggedIn=false
        }
    }
})

export const {login,logout}=SignIn.actions
export default SignIn.reducer;