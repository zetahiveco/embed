import { Router } from "express";
import { verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { APPLICATION_ERROR } from "../utils/errors";
import { createSource, deleteDatasource, fetchDatabaseSchema, fetchSourcesList } from "../services/sources.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const router = Router();


router.get(
    `/`,
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await fetchSourcesList(res.locals.organization)
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    `/`,
    verifyUserAuth,
    verifyMembership,
    validateRequest({
        body: z.object({
            name: z.string(),
            integration_type: z.string(),
            host: z.string(),
            port: z.string(),
            username: z.string(),
            database: z.string(),
            password: z.string()
        })
    }),
    async (req, res) => {
        try {
            await createSource(
                req.body.name,
                req.body.integration_type,
                req.body.database,
                req.body.host,
                req.body.port,
                req.body.username,
                req.body.password,
                res.locals.organization
            )
            res.status(201).json({ detail: `connection success` });
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
            await deleteDatasource(req.params["id"], res.locals.organization);
            res.status(200).json({ detail: "delete datasource" });
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)


router.get(
    "/:id/schema",
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            const result = await fetchDatabaseSchema(req.params["id"], res.locals.organization);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)



export default router;
