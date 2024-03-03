import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";


interface DashboardsState {
    dashboards: Array<any>
    renderToken: string
    fetchDashboards: () => Promise<void>
    createDashboard: (name: string) => Promise<void>
    deleteDashboard: (id: string) => Promise<void>
    updateDashboard: (name: string, dashboardId: string, layout: any) => Promise<void>
}

export const useDashboards = create<DashboardsState>((set) => ({
    dashboards: [],
    renderToken: "",
    fetchDashboards: async () => {
        const res = await axios.get(`/dashboards`);
        set(produce((draft) => {
            draft.dashboards = res.data.result;
            draft.renderToken = res.data.renderToken;
        }))
    },
    createDashboard: async (name: string) => {
        await axios.post(`/dashboards`, { name });
        const res = await axios.get(`/dashboards`);
        set(produce((draft) => {
            draft.dashboards = res.data.result;
            draft.renderToken = res.data.renderToken;
        }))
    },
    deleteDashboard: async (id: string) => {
        await axios.delete(`/dashboards/${id}`);
        set(produce((draft) => {
            const index = draft.dashboards.findIndex((src: any) => src.id === id);
            draft.dashboards.splice(index, 1);
        }))
    },
    updateDashboard: async (name: string, dashboardId: string, layout: any) => {
        await axios.put(`/dashboards/${dashboardId}`, {
            layout,
            name,
        });
    },
}))
