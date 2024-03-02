import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";


interface DashboardsState {
    dashboards: Array<any>

    fetchDashboards: () => Promise<void>
    createDashboard: (name: string) => Promise<void>
    deleteDashboard: (id: string) => Promise<void>
}

export const useDashboards = create<DashboardsState>((set) => ({
    dashboards: [],
    fetchDashboards: async () => {
        const res = await axios.get(`/dashboards`);
        set(produce((draft) => {
            draft.dashboards = res.data;
        }))
    },
    createDashboard: async (name: string) => {
        await axios.post(`/dashboards`, { name });
        const res = await axios.get(`/dashboards`);
        set(produce((draft) => {
            draft.dashboards = res.data;
        }))
    },
    deleteDashboard: async (id: string) => {
        await axios.delete(`/dashboards/${id}`);
        set(produce((draft) => {
            const index = draft.dashboards.findIndex((src: any) => src.id === id);
            draft.dashboards.splice(index, 1);
        }))
    }
}))
