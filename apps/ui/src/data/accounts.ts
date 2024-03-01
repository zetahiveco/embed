import axios from "axios";
import { create } from "zustand";
import { decodeJWT } from "../utils/jwt";
import Cookies from "js-cookie";
import { produce } from "immer";


export interface ChangePasswordForm {
    oldPassword: string
    newPassword: string
}

export interface InviteUserForm {
    email: string
    role: string
}

interface AccountsStore {
    userId: string
    name: string
    email: string
    organizations: Array<any>
    currentOrganization: string
    members: Array<any>
    userInvites: Array<any>
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, company: string, email: string, password: string) => Promise<void>
    fetchOrganizations: () => Promise<void>
    fetchUserData: () => Promise<void>
    switchOrganization: (organizationId: string) => void
    fetchMembers: () => Promise<void>
    changePassword: (data: ChangePasswordForm) => Promise<void>
    logout: () => void
    fetchUserInvites: () => Promise<void>
    inviteUser: (data: InviteUserForm) => Promise<void>
    removeInvite: (id: string) => Promise<void>
    acceptInvite: (data: any) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (data: any) => Promise<void>
}

export const useAccounts = create<AccountsStore>((set) => ({
    userId: "",
    name: "",
    email: "",
    organizations: [],
    currentOrganization: "",
    members: [],
    userInvites: [],
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
            draft.userId = res.data.id;
            draft.name = res.data.name;
            draft.email = res.data.email;
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
    },
    switchOrganization: (organizationId: string) => {
        Cookies.remove("organization-id");
        Cookies.set("organization-id", organizationId);
        set(produce((draft) => {
            draft.currentOrganization = organizationId
        }))

    },
    fetchMembers: async () => {
        const res = await axios.get(`/accounts/organizations/members`);
        set(produce((draft) => { draft.members = res.data }));
    },
    logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("organization-id");
        window.location.href = "/";
    },
    changePassword: async (data: ChangePasswordForm) => {
        await axios.put(`/accounts/users/change-password`, data);
    },
    fetchUserInvites: async () => {
        const res = await axios.get(`/accounts/organizations/user-invites`);
        set(produce((draft) => { draft.userInvites = res.data }));
    },
    inviteUser: async (data: InviteUserForm) => {
        await axios.post(`/accounts/organizations/invite-user`, data);
        const res = await axios.get(`/accounts/organizations/user-invites`);
        set(produce((draft) => { draft.userInvites = res.data }));
    },
    removeInvite: async (id: string) => {
        await axios.delete(`/accounts/organizations/user-invites/${id}`);
        set(produce((draft) => {
            let index = draft.userInvites.findIndex((ui: any) => ui.id === id);
            draft.userInvites.splice(index, 1);
        }));
    },
    acceptInvite: async (data: any) => {
        await axios.post(`/accounts/auth/accept-invite`, data);
        window.location.href = "/";
    },
    forgotPassword: async (email: string) => {
        await axios.post(`/accounts/auth/forgot-password`, { email: email });
    },
    resetPassword: async (data: any) => {
        await axios.post(`/accounts/auth/reset-password`, data);
    }
}))
