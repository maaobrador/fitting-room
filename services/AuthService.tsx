import { getToken, setToken } from "./TokenService";
import Constants from "expo-constants";
import axios from "@/components/Axios";

const API_BASE = Constants.expoConfig?.extra?.API_BASE || 'http://localhost:8000';

export async function login(credentials) {
  const { data }= await axios.post("/login", credentials);
  await setToken(data.token);
}

export async function loadUser() {
  const token = await getToken();

  const {data: user} = await axios.get("/user",{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return user;
}
