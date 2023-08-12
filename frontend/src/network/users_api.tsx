import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { User } from "../models/user";
import axios from "axios"

const url = process.env.NODE_ENV === 'production' ? 'http://178.244.224.244:3001' : 'http://localhost:3001';

async function fetchData(endpoint: string, method: "post" | "get" | "patch" | "delete", data = {}) {
    const response = await axios({
      method: method,
      url: url + endpoint,
      data: data,
      headers: {
        Authorization:
          "Bearer " +
          document.cookie
            .split(";")
            .find((cookie) => cookie.includes("jwt-access"))
            ?.split("=")[1],
      },
    });

    if (response.status === 200 || response.status === 201) {
        return response;
    } else {
        const errorBody = await response.data();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", "get");
    return response.data;
}


export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", "post", credentials);

    let d1 = new Date();
    let d2 = new Date();
    d1.setTime(d1.getTime() + 1000);
    d2.setTime(d2.getTime() + 7 * 24 * 60 * 60 * 1000);

    //save data to a cookie
    document.cookie = `jwt-access=${
      response.data.accessToken
    };expires=${d1.toUTCString()};path=/;httpOnly:true`;
    document.cookie = `jwt-refresh=${
      response.data.refreshToken
    };expires=${d2.toUTCString()};path=/;httpOnly:true`;
    
    return response.data;
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", "post", credentials);

    let d1 = new Date();
    let d2 = new Date();
    d1.setTime(d1.getTime() + 15 * 60 * 1000);
    d2.setTime(d2.getTime() + 7 * 24 * 60 * 60 * 1000);

    //save data to a cookie
    document.cookie = `jwt-access=${
      response.data.accessToken
    };expires=${d1.toUTCString()};path=/;httpOnly:true`;
    document.cookie = `jwt-refresh=${
      response.data.refreshToken
    };expires=${d2.toUTCString()};path=/;httpOnly:true`;

    return response.data;
}

export async function refresh(cookie: string): Promise<User> {
  const response = await fetchData("/api/users/refresh", "post", {
    refreshCookie: cookie,
  });

  let d1 = new Date();
  d1.setTime(d1.getTime() + 15 * 60 * 1000);

  //save data to a cookie
  document.cookie = `jwt-access=${response.data.accessToken};expires=${d1.toUTCString()};path=/;httpOnly:true`;


  return response.data;
}

export async function logout() {
    //delete all cookies
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(
            /=.*/,
            "=;expires=" +
              new Date().toUTCString() +
              ";path=/;httpOnly:true"
          );
    });
    
}




