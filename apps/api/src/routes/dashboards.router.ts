import { Router } from "express";
import { verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { createDashboard, deleteDashbaord, getDashboards } from "../services/dashboards.service";
import { APPLICATION_ERROR } from "../utils/errors";

const router = Router();

router.get(
    "",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await getDashboards(res.locals.organization);
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    "",
    verifyUserAuth,
    verifyMembership,
    validateRequest({
        body: z.object({
            name: z.string()
        })
    }),
    async (req, res) => {
        try {
            await createDashboard(req.body.name, res.locals.organization);
            res.status(201).json({ detail: "created" });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.delete(
    "/:id",
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            await deleteDashbaord(req.params.id, res.locals.organization);
            res.status(201).json({ detail: "ok" });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

export default router;