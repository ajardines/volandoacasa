import * as jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

let checkJWTCookie = (request: Request, response: Response, next: NextFunction) => {
  let token = request.cookies.auth;
  if (token) {
    jsonwebtoken.verify (token, process.env.SECRET_KEY, (err, usr) => {
      if (err) {
        return response.render('login', {error: err})
      } else {
        request.headers.user = usr;
      }
    });
  } else {
    console.log("#$$$ AQUI" )
    request.headers.user = null;
    return response.render('login', {error: "Inicie Sesión"})
  }
  next();
}

export { checkJWTCookie }