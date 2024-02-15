import axios from "axios";
import { create } from "zustand";
import { decodeJWT } from "../utils/jwt";
import Cookies from "js-cookie";
import { produce } from "immer";

interface AccountsStore {
    userId: string
    organizations: Array<any>
    currentOrganization: string

    login: (email: string, password: string) => Promise<void>
    signup: (name: string, company: string, email: string, password: string) => Promise<void>
    fetchOrganizations: () => Promise<void>
    fetchUserData: () => Promise<void>
}

export const useAccounts = create<AccountsStore>((set) => ({
    userId: "",
    organizations: [],
    currentOrganization: "",
    
    login: async (email: string, password: string) => {
        const res = await axios.post(`/accounts/auth/login`, { email, password });
        let accessDecoded = decodeJWT(res.data["accessToken"]);
        let refreshDecoded = decodeJWT(res.data["refreshToken"]);
        Cookies.set("accessToken", res.data["accessToken"], { expires: new Date(accessDecoded.exp * 1000) });
        Cookies.set("refreshToken", res.data["refreshToken"], { expires: new Date(refreshDecoded.exp * 1000) });
    },
    signup: async (name: string, company: string, email: string, password: string) => {
        await axios.post(`/accounts/auth/signup`, {
            name,
            company,
            email,
            password
        })
    },
    fetchUserData: async () => {
        const res = await axios.get(`/accounts/users/me`);
        set(produce((draft) => {
            draft.userId = res.data.userId
        }))
    },
    fetchOrganizations: async () => {
        const res = await axios.get(`/accounts/organizations`);

        
        // If the user doesnot have org in response remove from localstorage (used when admin removes this user)
        if (Cookies.get("organization-id")) {
            const stillAccess = res.data.find((o: any) => o.organizationId === Cookies.get("organization-id"));
            if (!stillAccess) {
                Cookies.remove("organization-id");
            }
        }

        if (!Cookies.get("organization-id") && res.data.length > 0) {
            Cookies.set("organization-id", res.data[0]["organizationId"]);
        }

        set(produce((draft) => {
            draft.currentOrganization = Cookies.get("organization-id")
        }))

        set(produce((draft) => { draft.organizations = res.data }));
    }
}))
