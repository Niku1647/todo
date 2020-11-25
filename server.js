const express = require('express')
const app = express()
const connectToDatabase = require('./config/connectToDatabase')
connectToDatabase();

app.use(express.json({ extended : false }))

app.use('/api/users', require('./routes/users'))


 let PORT = process.env.PORT || 5000;
 app.listen(PORT ,()=>console.log(`Server is running at Port:${PORT}`))