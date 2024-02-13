import { Router } from "express";

const router = Router();


// check if the server is functioning
router.get(
    "/",
    async (_, res) => {
        res.status(200).send("The server is running");
    }
)


export default router;