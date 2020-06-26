import { Controller } from "./controllers/controller";

import * as express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cookieParser from "cookie-parser";
import { UserAdmin } from "./middleware/userAdmin";
import { checkJWTCookie } from "./middleware/jwtToken";

dotenv.config();

let app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.get("/hello", Controller.helloWord)

app.get("/", checkJWTCookie, Controller.indexView)

app.get("/index", checkJWTCookie, Controller.indexView)

app.get("/login", Controller.loginView)

app.get('/logout', Controller.logout)

app.post("/login", Controller.login)

app.get('/logout', Controller.logout)

app.get("/users", checkJWTCookie, Controller.getUsers)

app.get("/create-user",checkJWTCookie, Controller.createUserView)

app.post("/create-user",checkJWTCookie, Controller.createUser)

app.post("/delete-user",checkJWTCookie, Controller.deleteUser)

mongoose.connect('mongodb://' + process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},(err) => {
  if (err) {
    throw err;
  } else {
    UserAdmin.createUserAdmin();
    console.log("Conectado a MongoDB")
  }
})

app.listen(process.env.PORT || 3035, function () {
  console.log("App is listening on port " + process.env.PORT || 3035 + "!!!");
});