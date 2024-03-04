import Database from "../storage/db";

export async function getDashboards(organizationId: string) {
    const prisma = Database.getInstance();
    let dashboards = await prisma.dashboard.findMany({
        where: {
            organizationId: organizationId
        },
    });

    dashboards.forEach((_, index) => {
        if (!dashboards[index].layout) {
            dashboards[index].layout = [];
        }
    })

    return dashboards;
}

export async function getDashboardById(dashboardId: string, organizationId: string) {
    const prisma = Database.getInstance();
    let dashboard = await prisma.dashboard.findFirstOrThrow({
        where: {
            id: dashboardId,
            organizationId: organizationId
        },
    });

    if (!dashboard.layout) {
        dashboard.layout = [];
    }

    return dashboard;
}

export async function createDashboard(name: string, organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.dashboard.create({
        data: {
            name: name,
            organizationId: organizationId
        }
    })
}


export async function updateDashboard(
    name: string,
    dashboardId: string,
    organizationId: string,
    layout: any
) {
    const prisma = Database.getInstance();

    await prisma.dashboard.update({
        where: {
            id: dashboardId,
            organizationId: organizationId
        },
        data: {
            name: name,
            layout: layout
        }
    })
}

export async function deleteDashbaord(id: string, organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.dashboard.delete({
        where: {
            id: id,
            organizationId: organizationId
        }
    })
}
