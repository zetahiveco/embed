import { Router } from "express";
import { publicRenderAuth, verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { createDashboard, deleteDashbaord, getDashboardById, getDashboards, updateDashboard } from "../services/dashboards.service";
import { APPLICATION_ERROR } from "../utils/errors";
import { generateRenderToken, getTestVariables } from "../services/secrets.service";

const router = Router();

router.get(
    "",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const testVariables = await getTestVariables(res.locals.organization);
            const renderToken = await generateRenderToken(
                "",
                testVariables.map((v) => ({
                    name: v.name,
                    value: v.value
                })),
                res.locals.organization
            );
            const result = await getDashboards(res.locals.organization);
            res.status(200).json({
                result,
                renderToken
            });
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

router.put(
    "/:id",
    verifyUserAuth,
    verifyMembership,
    validateRequest({
        body: z.object({
            name: z.string(),
            layout: z.any(),
        })
    }),
    async (req, res) => {
        try {
            await updateDashboard(
                req.body.name,
                req.params.id,
                res.locals.organization,
                req.body.layout
            );
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


router.get(
    "/:id/public",
    publicRenderAuth,
    async (req, res) => {
        try {
            const result = await getDashboardById(req.params.id, res.locals.resource);
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

export default router;
