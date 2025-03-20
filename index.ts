import express, {Express} from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as database from "./config/database";

import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();

database.connect();

const app:Express = express();
const port:number | string = process.env.PORT || 3000;  

// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));

const corsOptions = {
  origin: '*', // Hoặc domain cụ thể của frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  console.log('Test endpoint called');
  console.log('Headers:', req.headers);
  res.json({ message: 'Test endpoint working' });
});

mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});