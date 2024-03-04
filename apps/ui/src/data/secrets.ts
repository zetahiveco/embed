import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";

interface IApiKey {
    name: string
    apiKey: string
}

export interface CreateKeyForm {
    name: string
}

export interface ITestVariable {
    id: string
    name: string
    value: string
}

export interface TestVariableForm {
    name: string
    value: string
}

interface SecretsStore {
    keys: Array<IApiKey>
    getKeys: () => Promise<void>
    createKey: (data: CreateKeyForm) => Promise<void>
    deleteKey: (apiKey: string) => Promise<void>
    testVariables: Array<ITestVariable>
    getTestVariables: () => Promise<void>
    createTestVariable: (data: TestVariableForm) => Promise<void>
    deleteTestVariable: (id: string) => Promise<void>
}

export const useSecrets = create<SecretsStore>((set) => ({
    keys: [],
    testVariables: [],
    getKeys: async () => {
        const res = await axios.get(`/secrets/api-keys`);
        set(produce((draft) => {
            draft.keys = res.data;
        }))
    },
    createKey: async (data: CreateKeyForm) => {
        await axios.post(`/secrets/api-keys`, data);
        const res = await axios.get(`/secrets/api-keys`);
        set(produce((draft) => {
            draft.keys = res.data;
        }))
    },
    deleteKey: async (key: string) => {
        await axios.delete(`/secrets/api-keys/${key}`);
        set(produce((draft) => {
            const index = draft.keys.findIndex((k: IApiKey) => k.apiKey === key);
            draft.keys.splice(index, 1);
        }))
    },
    getTestVariables: async () => {
        const res = await axios.get(`/secrets/test-variables`);
        set(produce((draft) => {
            draft.testVariables = res.data;
        }))
    },
    createTestVariable: async (data: TestVariableForm) => {
        await axios.post(`/secrets/test-variables`, data);
        const res = await axios.get(`/secrets/test-variables`);
        set(produce((draft) => {
            draft.testVariables = res.data;
        }))
    },
    deleteTestVariable: async (id: string) => {
        await axios.delete(`/secrets/test-variables/${id}`);
        set(produce((draft) => {
            const index = draft.keys.findIndex((v: ITestVariable) => v.id === id);
            draft.testVariables.splice(index, 1);
        }))
    }
}))
