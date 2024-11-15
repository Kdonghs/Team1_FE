import { authSessionStorage } from "../utils/storage";
import { Auth } from "./generated/Auth";
import { Project } from "./generated/Project";
import { User } from "./generated/User";

const authToken = authSessionStorage.get()?.token;

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
};

export const authProjectApi = new Project(axiosConfig);
export const authUserApi = new User(axiosConfig);
export const authAuthApi = new Auth(axiosConfig);
