'use strict';

const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {PORT, HOST, HOST_URL, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === "true";

assert(PORT, 'PORT is require');
assert(HOST, 'HOST is required');







module.exports = {
    port: PORT ,
    host: HOST,
    url: HOST_URL,
    sql: {
        user: SQL_USER,
        password: SQL_PASSWORD,
        server: SQL_SERVER, // You can use 'localhost\\instance' to connect to named instance
        database:SQL_DATABASE ,
        
      
        options: {
            encrypt: true, // Use this if you're on Windows Azure
            trustServerCertificate: true,
            
        },
        pool: {
            max: 100,
            min: 0,
            idleTimeoutMillis: 600000
        }
      },
};