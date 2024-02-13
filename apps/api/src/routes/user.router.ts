import { Router } from "express";
import { APPLICATION_ERROR } from "../utils/errors";
import { createUser, generateAccessTokens, refreshAccessToken, sendEmailInvite, verifyUserInvite } from "../services/user.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { UserRoleType } from "@prisma/client";

const router = Router();

router.post(
    `/auth/login`,
    validateRequest({
        body: z.object({
            email: z.string().email(),
            password: z.string()
        })
    }),
    async (req, res) => {
        try {
            const tokens = await generateAccessTokens(req.body.email, req.body.password);
            res.status(200).json(tokens);
            return;
        } catch (err) {
            res.status(500).json(err);
            return;
        }
    }
)

router.post(
    `/auth/invite-user`,
    validateRequest({
        body: z.object({
            email: z.string(),
            role: z.string()
        })
    }),
    async (req, res) => {
        try {
            await sendEmailInvite(req.body.email, req.body.role as UserRoleType);
            res.status(200).json({ detail: `An invitation has been sent to ${req.body.email}` });
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    `/auth/accept-invite`,
    validateRequest({
        body: z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
            otp: z.string()
        })
    }),
    async (req, res) => {
        try {
            const invite = await verifyUserInvite(req.body.email, req.body.otp);
            if (!invite.status) {
                res.status(403).json({ detail: `invalid otp or email` });
            }
            await createUser(req.body.name, req.body.email, invite.role as UserRoleType, req.body.password);
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    `/auth/refresh-access-tokens`,
    validateRequest({
        body: z.object({
            refresh_token: z.string()
        })
    }),
    async (req, res) => {
        try {
            let accessToken = await refreshAccessToken(req.body.refresh_token);
            res.status(200).json({ access_token: accessToken });
            return;
        } catch (err) {
            res.status(401).json({ detail: err });
            return;
        }
    }
)
