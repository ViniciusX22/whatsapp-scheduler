import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

type QueryParams = {};

app.get<"/", {}, {}, {}, QueryParams>(
  "/",
  (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    res.status(200).send("Hello World");
  }
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
