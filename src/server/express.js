import express from 'express';

import path from 'path';
import bodyParser from "body-parser"
import cors from "cors"
var app = express();

app.use(cors());

app.use(bodyParser.json({limit: '1mb'}))

// Static path for uploads
app.use(express.static(path.resolve() + '/srv'));

export default app;




