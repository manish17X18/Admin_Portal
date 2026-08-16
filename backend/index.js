const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors({
    origin:'*',credentials:true
}));
app.use(express.json());

//routes
const routes=require('./routes/route')
//mount
app.use('/api/v1',routes)

//connect to port
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});