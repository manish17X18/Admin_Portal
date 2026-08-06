const express=require('express');
const router=express.Router();

const {createUser}=require('../controllers/user/createUser')
const {getusers}=require('../controllers/user/fetchUsers')
const {deleteUser}=require('../controllers/user/deleteUser')
const {editUser}=require('../controllers/user/editUser')

const {getRoles}=require('../controllers/role/fetchRoles')
const {createRole}=require('../controllers/role/addRole')
const {deleteRole}=require('../controllers/role/deleteRole')

const {createAdmin}=require('../controllers/admin/addAdmin')
const {getAdmins}=require('../controllers/admin/getAdmin')

const {login}=require('../controllers/auth/login')

const { getDashboardStats } = require('../controllers/dashboard_stats/dashboardController');

const { createRealm } = require('../controllers/realms/createRealm');
const { getRealms } = require('../controllers/realms/getRealms');

router.post('/createUser',createUser)
router.get('/getusers',getusers)
router.delete('/deleteUser',deleteUser)
router.put('/editUser',editUser)

router.get('/getRoles',getRoles);
router.post('/addRole',createRole);
router.delete('/deleteRole',deleteRole)

router.post('/createAdmin',createAdmin)
router.get('/getAdmins',getAdmins)

router.post('/login',login)

router.get('/dashboardStats', getDashboardStats);

router.post('/createRealm', createRealm);
router.get('/getRealm', getRealms);
module.exports=router