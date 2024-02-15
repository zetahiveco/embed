import Cookies from "js-cookie";
import { decodeJWT } from "./jwt";
import axios from "axios";

export async function getToken() {
    let accessToken = Cookies.get("access_token");
    let refreshToken = Cookies.get("refresh_token");

    if (!refreshToken) return null;


    if (!accessToken && refreshToken) {
        const axiosInstance = axios.create();
        let res = await axiosInstance.post(`${import.meta.env["REACT_APP_API"]}/accounts/auth/refresh`, {
            refresh: refreshToken
        });

        let accessClaims = decodeJWT(res.data["access_token"]);
        Cookies.set("access_token", res.data["access_token"], { expires: new Date(accessClaims.exp * 1000) });
        accessToken = res.data["access_token"];

    }

    return accessToken;
}
