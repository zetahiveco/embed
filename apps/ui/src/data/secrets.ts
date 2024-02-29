import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";

interface ISecret {
    name: string
    apiKey: string
}

export interface CreateSecretForm {
    name: string
}

interface SecretsStore {
    secrets: Array<ISecret>
    getSecrets: () => Promise<void>
    createSecret: (data: CreateSecretForm) => Promise<void>
    deleteSecret: (apiKey: string) => Promise<void>
}

export const useSecrets = create<SecretsStore>((set) => ({
    secrets: [],
    getSecrets: async () => {
        const res = await axios.get(`/api-keys`);
        set(produce((draft) => {
            draft.secrets = res.data;
        }))
    },
    createSecret: async (data: CreateSecretForm) => {
        await axios.post(`/api-keys`, data);
        const res = await axios.get(`/api-keys`);
        set(produce((draft) => {
            draft.secrets = res.data;
        }))
    },
    deleteSecret: async (key: string) => {
        await axios.delete(`/api-keys/${key}`);
        set(produce((draft) => {
            const index = draft.secrets.findIndex((s: ISecret) => s.apiKey === key);
            draft.secrets.splice(index, 1);
        }))
    }
}))
