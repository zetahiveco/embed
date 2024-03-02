import { Express } from "express";
import healthRouter from "./routes/health.router";
import accountsRouter from "./routes/accounts.router";
import sourcesRouter from "./routes/sources.router";
import visualizationsRouter from "./routes/visualizations.router";
import secretsRouter from "./routes/secrets.router";
import dashboardsRouter from "./routes/dashboards.router";


// routes are configured here
export default function useRouter(app: Express) {
    app.use("/api/v1/health", healthRouter);
    app.use("/api/v1/accounts", accountsRouter);
    app.use("/api/v1/sources", sourcesRouter);
    app.use("/api/v1/secrets", secretsRouter);
    app.use("/api/v1/visualizations", visualizationsRouter);
    app.use("/api/v1/dashboards", dashboardsRouter);
}
