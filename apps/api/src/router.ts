import { Express } from "express";
import healthRouter from "./routes/health.router";

// routes are configured here
export default function useRouter(app: Express) {
    app.use("/api/v1/health", healthRouter);
}
