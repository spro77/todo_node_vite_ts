import express from 'express';
import cors from 'cors';
import apiRoutes from './api/index.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
