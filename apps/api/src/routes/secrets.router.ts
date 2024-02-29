import { Router } from "express";
import { APPLICATION_ERROR } from "../utils/errors";
import { verifyUserAuth } from "../middlewares/auth.middleware";
import { verifyMembership } from "../middlewares/organization.middleware";
import { createApiKey, deleteApiKey, generateRenderToken, getApiKeys } from "../services/secrets.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const router = Router();

router.get(
    "",
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const result = await getApiKeys(res.locals.organization);
            res.status(200).json(result);
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
            await createApiKey(req.body.name, res.locals.organization);
            res.status(201).json({ detail: "created" });
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
            await deleteApiKey(req.params.id, res.locals.organization);
            res.status(201).json({ detail: "created" });
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)


router.post(
    "/generate-render-token",
    async (req, res) => {
        try {
            const apiKey = req.headers.authorization?.split(" ")[1];
            if (!apiKey) {
                res.status(401).json(`no api key found`);
                return;
            }
            let token = await generateRenderToken(apiKey);
            res.status(200).json({ renderToken: token });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)


export default router;
