import { IntegrationType } from "@prisma/client";
import Database from "../storage/db";
import databaseExecutor from "./database.service";


export async function fetchSourcesList(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.dataSource.findMany({
        where: {
            organization_id: organizationId
        },
        select: {
            name: true,
            integration_mechanism: true,
            host: true,
            port: true
        }
    })
}

export async function createSource(
    name: string,
    integrationType: string,
    database: string,
    host: string,
    port: string,
    username: string,
    password: string,
    organizationId: string
) {
    const prisma = Database.getInstance();

    await databaseExecutor(
        integrationType as IntegrationType,
        database,
        host,
        parseInt(port),
        username,
        password,
        `
            SELECT 1;
        `
    )

    return await prisma.dataSource.create({
        data: {
            name: name,
            integration_mechanism: IntegrationType.POSTGRESQL,
            host: host,
            database: database,
            username: username,
            password: password,
            port: parseInt(port),
            organization_id: organizationId
        }
    })
}

export async function deleteDatasource(id: string, organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.dataSource.delete({
        where: {
            id: id,
            organization_id: organizationId
        }
    });
}


export async function fetchDatabaseSchema(id: string, organizationId: string) {
    const prisma = Database.getInstance();
    const datasource = await prisma.dataSource.findUniqueOrThrow({
        where: {
            id: id,
            organization_id: organizationId
        }
    });

    const query = `
                SELECT 
                    t.table_name, 
                    c.column_name, 
                    c.data_type 
                FROM 
                    information_schema.tables t 
                JOIN 
                    information_schema.columns c ON c.table_name = t.table_name 
                WHERE 
                    t.table_schema = 'public' 
                ORDER BY 
                    t.table_name, c.ordinal_position;
            `;

    let data = await databaseExecutor(
        datasource.integration_mechanism,
        datasource.database,
        datasource.host,
        datasource.port,
        datasource.username,
        datasource.password,
        query
    )

    const schema: { [table_name: string]: { [column_name: string]: string } } = {};

    data.forEach((row: any) => {
        if (!schema[row.table_name]) {
            schema[row.table_name] = {};
        }
        schema[row.table_name][row.column_name] = row.data_type;
    });
}
