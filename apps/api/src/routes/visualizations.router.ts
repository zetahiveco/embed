import { Router } from "express";
import { verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { APPLICATION_ERROR } from "../utils/errors";
import { createVisualization, fetchVisualizations, getVisualizationData, updateVisualization, upsertRenderFormat } from "../services/visualization.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const router = Router();

router.get(
    "",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await fetchVisualizations(res.locals.organization);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    "",
    validateRequest({
        body: z.object({
            name: z.string(),
            datasource: z.string(),
            plainSql: z.string(),
        })
    }),
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            const result = await createVisualization(
                req.body.name,
                req.body.datasource,
                req.body.plainSql,
                res.locals.organization
            );
            res.status(200).json({ detail: result });
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.put(
    "/:id",
    validateRequest({
        body: z.object({
            name: z.string(),
            datasource: z.string(),
            plainSql: z.string(),
        })
    }),
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            await updateVisualization(
                req.params.id,
                req.body.name,
                req.body.datasource,
                req.body.plainSql,
                res.locals.organization
            );
            res.status(200).json({ detail: "updated" });
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.get(
    "/:id/data",
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            const result = await getVisualizationData(req.params.id, res.locals.organization);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(JSON.stringify(err));
            return;
        }
    }
)


router.post(
    "/:id/render",
    validateRequest({
        body: z.object({
            chartType: z.string(),
            renderFormat: z.any()
        })
    }),
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            await upsertRenderFormat(
                req.params.id,
                res.locals.organization,
                req.body.chartType,
                req.body.renderFormat
            )
            res.status(200).json({ detail: "updated" });
            return;
        } catch(err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

export default router;
