const userRoutes = require('@src/routes/userRouter').router;
import express from 'express';

export const createServer = () => {
    //Initialise server variable
    const app = express();

    //Content-Type application/json
    app.use(express.json());
    
    //Define API routes for user service
    app.use('/api/users',userRoutes);

    return app;
};
