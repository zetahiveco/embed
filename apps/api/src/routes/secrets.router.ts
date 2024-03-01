import { Router } from "express";
import { APPLICATION_ERROR } from "../utils/errors";
import { verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { createApiKey, createTestVariable, deleteApiKey, deleteTestVariable, generateRenderToken, getApiKeys, getTestVariables } from "../services/secrets.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const router = Router();

router.get(
    "/api-keys",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await getApiKeys(res.locals.organization);
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    "/api-keys",
    verifyUserAuth,
    verifyMembership,
    validateRequest({
        body: z.object({
            name: z.string()
        })
    }),
    async (req, res) => {
        try {
            await createApiKey(req.body.name, res.locals.organization);
            res.status(201).json({ detail: "created" });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.delete(
    "/api-keys/:id",
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            await deleteApiKey(req.params.id, res.locals.organization);
            res.status(201).json({ detail: "ok" });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)


router.get(
    "/test-variables",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await getTestVariables(res.locals.organization);
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    "/test-variables",
    verifyUserAuth,
    verifyMembership,
    validateRequest({
        body: z.object({
            name: z.string(),
            type: z.string(),
            value: z.string()
        })
    }),
    async (req, res) => {
        try {
            await createTestVariable(
                req.body.name,
                req.body.type,
                req.body.value,
                res.locals.organization
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
    "/test-variables/:id",
    verifyUserAuth,
    verifyMembership,
    async (req, res) => {
        try {
            await deleteTestVariable(req.params.id, res.locals.organization);
            res.status(201).json({ detail: "ok" });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)



router.post(
    "/api-keys/generate-render-token",
    validateRequest({
        body: z.object({
            variables: z.array(
                z.object({
                    name: z.string(),
                    type: z.string(),
                    value: z.string()
                })
            )
        })
    }),
    async (req, res) => {
        try {
            const apiKey = req.headers.authorization?.split(" ")[1];
            if (!apiKey) {
                res.status(401).json(`no api key found`);
                return;
            }
            let token = await generateRenderToken(apiKey, req.body.variables);
            res.status(200).json({ renderToken: token });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

export default router;
