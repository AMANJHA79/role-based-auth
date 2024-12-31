require('dotenv').config();
const express= require('express');
const connectToDb =require('./database/db');
const authRoutes = require('./routes/auth-routes');
const HomeRouter = require('./routes/home-routes')
const adminrouter = require('./routes/admin-routes')



const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from HomePage');
});

app.use('/api', authRoutes );
app.use('/api', HomeRouter );
app.use('/api', adminrouter );


const connectserver=async()=>{
    await connectToDb();
    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

connectserver();