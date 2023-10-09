import express from 'express';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});


app.use(express.json());


app.use('/user', userRoutes);
app.use('/videos', videosRoutes);

app.get('/', (request: any, response: any) => {
    response.status(200).json({ message: 'Conectado com sucesso' });
})


//localhost:4000
app.listen(4000);
