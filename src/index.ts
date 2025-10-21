import * as express from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import userRouter from "./router/userRouter";

AppDataSource.initialize()
  .then(async () => {

    // create express app
    const app = express();
    app.use(express.json());

    // setup express app here
    app.use("/api", userRouter);


    // start express server
    app.listen(3000);
    console.log("Express server has started on port 3000.");
    
  })
  .catch((error) => console.log(error));
