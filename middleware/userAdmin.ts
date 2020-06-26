import User, { IUser } from "../models/userSchema";
import * as _ from "lodash";
import * as bcrypt from "bcrypt";

export class UserAdmin {

  public static createUserAdmin() {
    User.find({ userName: "admin"})
      .then((userFound) => {
        if (_.isEmpty(userFound)) {
          const name = "Administrador";
          const userName = "admin";
          const password = bcrypt.hashSync("wZAx7*3jTGdm", 10);
          const role = "admin";
          let user = new User({
            name: name,
            userName: userName,
            password: password,
            role: role
          });
          user.save()
            .then((userCreated: IUser) => {
              console.log("Usuario " + userCreated.name + " creado!!")
            })
            .catch((error) => {
              console.log(error);
            });
        }   
      })
      .catch((error) => {
        console.log(error);
      });
  }
}