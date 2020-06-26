import User from '../models/userSchema';
import { Request, Response } from "express";
import * as _ from "lodash";
import * as bcrypt from "bcrypt";
import * as jsonwebtoken from "jsonwebtoken";

export class Controller {

  public static helloWord(request: Request, response: Response) {
    response.send("Hello Word !!#$% ;-)");
  }

  public static loginView(request: Request, response: Response) {
    response.render('login');
  }

  public static indexView(request: Request, response: Response) {
    response.render('index', {user: request.headers.user});
  }

  public static login(request: Request, response: Response) {
    let user: any = new Object();
    user.userName = request.body.userName;
    user.password = request.body.password;

    User.find({userName: user.userName})
      .then((userFound: any[]) => {
        if (_.isEmpty(userFound)) {
          return response.render('login', {error: "El usuario no existe!"});
        }
        const correctPassword = bcrypt.compareSync(user.password, _.head(userFound).password);
        if (!correctPassword) {
          return response.render('login', {error: "Contraseña incorrecta"});
        }
        const expiresIn = 24 * 60 *60;
        const accessToken = jsonwebtoken.sign(
          {
            id: _.head(userFound).id,
            name: _.head(userFound).name,
            userName: _.head(userFound).userName,
            role: _.head(userFound).role,
          }, process.env.SECRET_KEY, {
          expiresIn: expiresIn
        });
        response.cookie('auth', accessToken);
        response.redirect('index');
      })
      .catch((error) => {
        response.render('login', {error: error})
      })
  }

  public static logout(request: Request, response: Response) {
    response.cookie("auth", null);
    response.redirect('login');
  }
  public static getUsers(request: Request, response: Response) {
    User.find()
      .then((users: any[]) => {
        response.render('users',
          {
            user: request.headers.user,
            users: users
          }
        );
      })
      .catch((error) => {
        response.render('index', {error: error})
      }) 
  }

  public static createUserView(request: Request, response: Response) {
    response.render('create-user', {user: request.headers.user});
  }

  public static createUser(request: Request, response: Response) {
    const userName = request.body.userName;
    let password = request.body.password;
    User.find({userName: userName})
      .then((userFound: any[]) => {
        if (!_.isEmpty(userFound)) {
          return response.render('create-user', {error: "Ya existe un usuario con ese nombre de usuario",
            user: request.headers.user});
        } else {
          password = bcrypt.hashSync(password, 10);
          let user = new User({
            name: request.body.name,
            userName: request.body.userName,
            password: password,
            role: request.body.role,
          });
          user.save()
            .then((userCreated: any) => {
              return response.redirect('users')
            })
            .catch((error) => {
              return response.render('create-user', {error: error, user: request.headers.user});
            })
        }
      })
      .catch((error) => {
        return response.render('create-user', {error: error, user: request.headers.user});
      })
  }

  public static deleteUser(request: Request, response: Response) {
    const id = request.body.id;
    User.findOneAndDelete({_id: id})
      .then((userdDleted: any) => {
        response.redirect('users');
      })
      .catch((error) => {
        return response.render('users', {error: error, user: request.headers.user});
      })
  }
}
