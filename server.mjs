import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import ErrorResponse from './utilities/ErrorResponseModel.mjs';
import membersRouter from './routes/members-routes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

global.__appdir = dirname;

app.use(express.json());

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/members', membersRouter);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Could't find the resource ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const PORT = process.argv[2] || process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
