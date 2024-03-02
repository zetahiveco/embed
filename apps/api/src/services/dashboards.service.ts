import Database from "../storage/db";

export async function getDashboards(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.dashboard.findMany({
        where: {
            organizationId: organizationId
        },
        include: {
            cards: {
                include: {
                    visualization: true
                }
            }
        }
    })
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



export async function deleteDashbaord(id: string, organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.dashboard.delete({
        where: {
            id: id,
            organizationId: organizationId
        }
    })
}
