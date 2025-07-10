import express from 'express';
import categoryRouter from './routes/category.route.js';
import uploadRoute from "./routes/upload.route.js";
import authRoute from './routes/auth.route.js';
import cors from 'cors'; 
import bookRoute from './routes/book.route.js'




const app = express();
app.use(express.json());
app.use(cors()); 


// Dùng router
app.use('/api/v1/cat', categoryRouter);//route category
app.use("/api/v1", uploadRoute); //  router upload
app.use('/api/v1', authRoute);//router auth
app.use('/api/v1/book', bookRoute);





app.listen(9999, () => {
    console.log('Server running on port 9999');
});
