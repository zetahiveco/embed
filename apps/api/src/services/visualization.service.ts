import { ChartType } from "@prisma/client";
import Database from "../storage/db";

export async function fetchVisualizations(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.visualization.findMany({
        where: {
            organizationId: organizationId
        }
    });
}


export async function updateVisualization(id: string, name: string, datasource: string, plainSql: string, chartType: string) {
    const prisma = Database.getInstance();
    return await prisma.visualization.update({
        where: {
            id: id
        },
        data: {
            name: name,
            datasourceId: datasource,
            plainSql: plainSql,
            chartType: chartType as ChartType
        }
    })
}
