import { Router } from "express";
import { publicRenderAuth, verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { APPLICATION_ERROR } from "../utils/errors";
import { createVisualization, fetchVisualizations, getVisualizationData, updateVisualization, upsertRenderFormat } from "../services/visualization.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { generateRenderToken, getTestVariables } from "../services/secrets.service";

const router = Router();

router.get(
    "",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await fetchVisualizations(res.locals.organization);
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
            return;
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
            return;
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
            const testVariables = await getTestVariables(res.locals.organization);
            const cleanTestVariables = testVariables.map((v) => ({
                name: v.name,
                value: v.value
            }))
            const renderToken = await generateRenderToken(
                "",
                cleanTestVariables,
                res.locals.organization
            );

            const result = await getVisualizationData(req.params.id, res.locals.organization, cleanTestVariables);
            res.status(200).json({
                result,
                renderToken
            });
            return;
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
            const result = await getVisualizationData(req.params.id, res.locals.resource, res.locals.variables);
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)


export default router;
