import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";


interface Visualization {
    id: string
    name: string
    chartType: string
    datasourceId: string
    plainSql: string
    organizationId: String
}

interface VisualizationForm {
    name: string
    chartType: string
    datasourceId: string
    plainSql: string
}

interface VisualizationsStore {
    data: Array<Visualization>
    fetchVisualizations: () => Promise<void>
    addVisualization: (data: VisualizationForm) => Promise<void>
    deleteVisualization: (id: string) => Promise<void>
}

export const useVisualizations = create<VisualizationsStore>((set) => ({
    data: [],
    fetchVisualizations: async () => {
        const res = await axios.get(`/visualizations`);
        set(produce((draft) => {
            draft.data = res.data;
        }))
    },
    addVisualization: async (data: VisualizationForm) => {
        await axios.post(`/visualizations`, data);
        const res = await axios.get(`/visualizations`);
        set(produce((draft) => {
            draft.data = res.data;
        }))
    },
    updateVisualization: async (id: string, data: VisualizationForm) => {
        await axios.put(`/visualizations/${id}`, data);
        const res = await axios.get(`/visualizations`);
        set(produce((draft) => {
            draft.data = res.data;
        }))
    },
    deleteVisualization: async (id: string) => {
        await axios.delete(`/visualizations/${id}`);
        set(produce((draft) => {
            const index = draft.visualizations.findIndex((viz: any) => viz.id === id);
            draft.visualizations.splice(index, 1);
        }))
    }
}))
