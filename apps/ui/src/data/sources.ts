import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";

export interface CreateSourceForm {
    name: string
    integrationType: string
    database: string
    host: string
    port: string
    username: string
    password: string
}

interface SourcesState {
    sources: Array<any>

    fetchSources: () => Promise<void>
    insertSource: (data: CreateSourceForm) => Promise<void>
    deleteSource: (id: string) => Promise<void>
}

export const useSources = create<SourcesState>((set) => ({
    sources: [],
    fetchSources: async () => {
        const res = await axios.get(`/sources`);
        set(produce((draft) => {
            draft.sources = res.data;
        }))
    },
    insertSource: async (data: CreateSourceForm) => {
        await axios.post(`/sources`, data);
        const res = await axios.get(`/sources`);
        set(produce((draft) => {
            draft.sources = res.data;
        }))
    },
    deleteSource: async (id: string) => {
        await axios.delete(`/sources/${id}`);
        set(produce((draft) => {
            const index = draft.sources.findIndex((src: any) => src.id === id);
            draft.sources.splice(index, 1);
        }))
    }
}))
