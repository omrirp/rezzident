import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import accountRouter from './routes/account.js';
import companyRouter from './routes/company.js';
import assetsRouter from './routes/assets.js';
import leadsRouter from './routes/leads.js';
import agentsRouter from './routes/agents.js';
import dealsRouter from './routes/deals.js';
import clientsRouter from './routes/clients.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/account', accountRouter);
app.use('/api/company', companyRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/clients', clientsRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
