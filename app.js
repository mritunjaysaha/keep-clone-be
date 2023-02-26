"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require('dotenv').config();
const express_1 = __importDefault(require("express"));
// import cors from "cors";
// import cookieParser from "cookie-parser";
const db_config_1 = require("./config/db.config");
// ROUTES
//  INITIALIZE APP
const app = (0, express_1.default)();
exports.app = app;
// CONNECT DATABASE
(0, db_config_1.connectDB)();
//  INITIALIZE MIDDLEWARE
// app.use(cors({ origin: true, credentials: true }));
// app.use(cookieParser());
// app.use(express.json({ extend: false }));
app.get('/', (req, res) => {
    res.send('Server up and running');
});
