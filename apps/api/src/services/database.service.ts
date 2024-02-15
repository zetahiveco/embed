import { Client as PgClient } from "pg";
import mysql from "mysql2";
import { IntegrationType } from "@prisma/client";

export default async function databaseExecutor(
    connectionType: IntegrationType,
    database: string,
    host: string,
    port: number,
    username: string,
    password: string,
    query: string
): Promise<any> {
    if (connectionType === IntegrationType.POSTGRESQL) {
        const client = new PgClient({
            user: username,
            host: host,
            database: database,
            password: password,
            port: port,
        })

        await client.connect();

        const data = await client.query(query);
        await client.end();
        return data.rows;
    }

    if (connectionType === IntegrationType.MYSQL) {
        const connection = mysql.createConnection({
            user: username,
            host: host,
            database: database,
            password: password,
            port: port
        })

        const data = await connection.promise().query(query);
        return data;
    }

    throw new Error("invalid connection type");
}
