import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import './Models/db.js';
import bodyParser from 'body-parser';   
import Members from './Models/Members.js';
import MembersRouter from './Routes/MembersRouter.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT ;

app.use('/Members', MembersRouter);
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

