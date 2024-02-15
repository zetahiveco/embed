import Cookies from "js-cookie";
import { decodeJWT } from "./jwt";
import axios from "axios";

export async function getToken() {
    let accessToken = Cookies.get("accessToken");
    let refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) return null;


    if (!accessToken && refreshToken) {
        const axiosInstance = axios.create();
        let res = await axiosInstance.post(`${import.meta.env["REACT_APP_API"]}/accounts/auth/refresh`, {
            refresh: refreshToken
        });

        let accessClaims = decodeJWT(res.data["accessToken"]);
        Cookies.set("accessToken", res.data["accessToken"], { expires: new Date(accessClaims.exp * 1000) });
        accessToken = res.data["accessToken"];

    }

    return accessToken;
}
