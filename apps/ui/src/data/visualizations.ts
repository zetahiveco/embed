import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";


export interface IVisualization {
    id: string
    name: string
    datasourceId: string
    plainSql: string
    organizationId: String
    render: {
        chartType: string
        format: any
    } | null
}

export interface VisualizationForm {
    name: string
    datasource: string
    plainSql: string
}

export interface RenderForm {
    chartType: string
    renderFormat: any
}

interface VisualizationsStore {
    data: Array<IVisualization>
    resultData: Array<any>
    queryError: string
    renderToken: string
    fetchVisualizations: () => Promise<void>
    addVisualization: (data: VisualizationForm) => Promise<string>
    updateVisualization: (id: string, data: VisualizationForm) => Promise<void>
    deleteVisualization: (id: string) => Promise<void>
    upsertRenderFormat: (id: string, data: RenderForm) => Promise<void>
    fetchVisualizationData: (id: string) => Promise<void>
}

export const useVisualizations = create<VisualizationsStore>((set) => ({
    data: [],
    resultData: [],
    queryError: "",
    renderToken: "",
    fetchVisualizationData: async (id: string) => {
        try {
            const res = await axios.get(`/visualizations/${id}/data`);
            set(produce((draft) => {
                draft.resultData = res.data.result.resultData;
                draft.renderToken = res.data.renderToken;
                draft.queryError = "";
            }));
        } catch (err: any) {
            set(produce((draft) => {
                draft.resultData = [];
                draft.queryError = err.response.data;
            }));
        }
    },
    fetchVisualizations: async () => {
        const res = await axios.get(`/visualizations`);
        set(produce((draft) => {
            draft.data = res.data;
        }))
    },
    addVisualization: async (data: VisualizationForm) => {
        const id = await axios.post(`/visualizations`, data);
        const res = await axios.get(`/visualizations`);
        set(produce((draft) => {
            draft.data = res.data;
        }))
        return id.data.detail;
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
    },
    upsertRenderFormat: async (id: string, data: RenderForm) => {
        await axios.post(`/visualizations/${id}/render`, data);
        const res = await axios.get(`/visualizations`);
        set(produce((draft) => {
            draft.data = res.data;
        }))
    }
}))
