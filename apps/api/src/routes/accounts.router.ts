import { Router } from "express";
import { APPLICATION_ERROR } from "../utils/errors";
import { checkIfUserExists, createUser, fetchMembers, fetchOrganizations, generateAccessTokens, getUser, refreshAccessToken, sendEmailInvite, verifyUserInvite } from "../services/accounts.service";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { verifyUserAuth } from "../middlewares/auth.middleware";
import { checkIfOrganizationAdmin, verifyMembership } from "../middlewares/organization.middleware";


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
    `/auth/signup`,
    validateRequest({
        body: z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
            company: z.string()
        })
    }),
    async (req, res) => {
        try {

            const userExists = await checkIfUserExists(req.body.email);

            if (userExists) {
                res.status(400).json({ detail: `user already exists` });
                return;
            }

            await createUser(
                req.body.name,
                req.body.email,
                req.body.password,
                "ADMIN",
                req.body.company
            )
            res.status(201).json({ detail: `account created` });
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.post(
    `/auth/invite-user`,
    verifyUserAuth,
    verifyMembership,
    checkIfOrganizationAdmin,
    validateRequest({
        body: z.object({
            email: z.string().email(),
            role: z.string()
        })
    }),
    async (req, res) => {
        try {
            await sendEmailInvite(req.body.email, '', req.body.role);
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
            await createUser(req.body.name, req.body.email, invite.role as string, req.body.password);
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
    (req, res) => {
        try {
            let accessToken = refreshAccessToken(req.body.refresh_token);
            res.status(200).json({ accessToken });
            return;
        } catch (err) {
            res.status(401).json({ detail: err });
            return;
        }
    }
)

router.get(
    `/organizations`,
    verifyUserAuth,
    async (_, res) => {
        try {
            const organizations = await fetchOrganizations(res.locals.user);
            res.status(200).json(organizations);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)


router.get(
    `/organizations/members`,
    verifyUserAuth,
    verifyMembership,
    async (_, res) => {
        try {
            const members = await fetchMembers(res.locals.organization);
            res.status(200).json(members);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

router.get(
    `/users/me`,
    verifyUserAuth,
    async (_, res) => {
        try {
            const result = await getUser(res.locals.user);
            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(500).json(APPLICATION_ERROR);
            return;
        }
    }
)

export default router;