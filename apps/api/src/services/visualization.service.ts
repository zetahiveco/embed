import { ChartType } from "@prisma/client";
import Database from "../storage/db";
import databaseExecutor from "./database.service";
import format from "string-template";

export async function fetchVisualizations(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.visualization.findMany({
        where: {
            organizationId: organizationId
        },
        include: {
            render: true
        }
    });
}

export async function createVisualization(name: string, datasource: string, plainSql: string, organizationId: string) {
    const prisma = Database.getInstance();
    const visualization = await prisma.visualization.create({
        data: {
            name: name,
            datasourceId: datasource,
            plainSql: plainSql,
            organizationId: organizationId,
        }
    });

    return visualization.id.toString();
}

export async function updateVisualization(id: string, name: string, datasource: string, plainSql: string, organizationId: string) {
    const prisma = Database.getInstance();
    await prisma.visualization.update({
        where: {
            id: id,
            organizationId: organizationId
        },
        data: {
            name: name,
            datasourceId: datasource,
            plainSql: plainSql,
        }
    })

    await prisma.render.deleteMany({
        where: {
            visualizationId: id,
            organizationId: organizationId
        }
    })

    return;
}

export async function getVisualizationData(id: string, organizationId: string, variables: Array<{ name: string, value: string }>) {

    const prisma = Database.getInstance();

    const visualization = await prisma.visualization.findFirstOrThrow({
        where: {
            id: id,
            organizationId: organizationId
        },
        include: {
            datasource: true,
            render: true
        }
    });

    let formatVariables: any = {};

    variables.forEach(v => {
        formatVariables[v.name] = v.value
    })

    let plainSql = format(visualization.plainSql, formatVariables);

    const resultData = await databaseExecutor(
        visualization.datasource.integrationType,
        visualization.datasource.database,
        visualization.datasource.host,
        visualization.datasource.port,
        visualization.datasource.username,
        visualization.datasource.password,
        plainSql
    )


    return {
        resultData,
        name: visualization.name,
        renderFormat: visualization.render
    }
}


export async function upsertRenderFormat(visualizationId: string, organizationId: string, chartType: string, renderFormat: any) {
    const prisma = Database.getInstance();
    const render = await prisma.render.findFirst({
        where: {
            visualizationId: visualizationId,
            organizationId: organizationId
        }
    });

    if (render) {
        return await prisma.render.update({
            where: {
                visualizationId: visualizationId,
                organizationId: organizationId
            },
            data: {
                chartType: chartType as ChartType,
                format: renderFormat
            }
        })
    }

    return await prisma.render.create({
        data: {
            chartType: chartType as ChartType,
            format: renderFormat,
            organizationId: organizationId,
            visualizationId: visualizationId
        }
    })
}
