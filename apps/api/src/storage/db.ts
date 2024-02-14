import { PrismaClient } from "@prisma/client";

export default class Database {

    private static _instance: Database | null = null;
    private _db: PrismaClient;

    private constructor() {
        this._db = new PrismaClient();
    }

    public static getInstance(): PrismaClient {
        if (!Database._instance) {
            Database._instance = new Database();
        }

        return Database._instance._db;
    }

    public static async destroyActiveConnections() {
        if (Database._instance) {
            await Database._instance._db.$disconnect();
        }
    }

}
