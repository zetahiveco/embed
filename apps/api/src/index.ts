import express from "express";
import useRouter from "./router";
import Database from "./storage/db";


async function start() {

    const PORT = process.env.PORT || 8080;

    const app = express();

    app.use(express.json());

    useRouter(app);

    app.listen(PORT, () => { console.log(`Api listening on http://localhost:${PORT}`) });

}

start().catch((err) => console.log(err));

process.on("exit", async () => {
    await Database.destroyActiveConnections();
})
