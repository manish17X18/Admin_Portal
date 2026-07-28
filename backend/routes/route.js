const express=require('express');
const router=express.Router();

const {createUser}=require('../controllers/user/createUser')
const {getusers}=require('../controllers/user/fetchUsers')
const {deleteUser}=require('../controllers/user/deleteUser')

const {getRoles}=require('../controllers/role/fetchRoles')
const {createRole}=require('../controllers/role/addRole')

router.post('/createUser',createUser)
router.get('/getusers',getusers)
router.delete('/deleteUser',deleteUser)

router.get('/getRoles',getRoles);
router.post('/addRole',createRole);

module.exports=router