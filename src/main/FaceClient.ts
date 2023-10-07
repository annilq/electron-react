/* eslint-disable prettier/prettier */
import fs from 'fs';
import { face as AipFaceClient } from 'baidu-aip-sdk';

// const APP_ID = '31007154';
// const API_KEY = 'NBCZ7aUAWdvqup4CMFg0q5SY';
// const SECRET_KEY = 'me2roIuC72mAbXSZWLo52pp8zAsWlG8A';
const APP_ID = '420182';
const API_KEY = 'r0Aya0VWmgTrqEN3XC8QaYu6';
const SECRET_KEY = 'Kvwo9IllExUMNsCyStzxluBBdGNdx86G';

export default new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
