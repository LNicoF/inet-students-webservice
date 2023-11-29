import waitPort from 'wait-port';
import mysql from 'mysql2'
// import { createConnection } from 'mysql2'

const {
    DB_HOST = 'localhost',
    DB_PORT = '3306',
    DB_USER = 'students',
    DB_PASS = '1234',
    DB = 'inet',
} = process.env

const connection = new Promise((resolve) => {
    waitPort({
        host: DB_HOST,
        port: parseInt( DB_PORT ),
        timeout: 1000,
        waitForDns: true,
    })

    resolve( mysql.createConnection( {
        host: DB_HOST,
        port: parseInt( DB_PORT ),
        user: DB_USER,
        password: DB_PASS,
        database: DB,
    }))
})

export const getConnection = () => connection