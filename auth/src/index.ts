import express from "express";
import { json } from "body-parser";

//Routes
import { currentUserRouter } from "./routes/currentUser";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

//Middlewares
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("listening on 3000");
});
