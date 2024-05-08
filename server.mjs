import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import ErrorResponse from './utilities/ErrorResponseModel.mjs';
import membersRouter from './routes/members-routes.mjs';
import { PORT } from './startup.mjs';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/members', membersRouter);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Could't find the resource ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
