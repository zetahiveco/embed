import { Box, Button, FormControl, FormLabel, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Select } from "@chakra-ui/react";
import { RenderForm, useVisualizations } from "../../../data/visualizations";
import { useEffect, useState } from "react";
import { produce } from "immer";

export default function UpdateRenderFormat({ id, onClose }: { id: string, onClose: () => void }) {

    const [loading, setLoading] = useState(false);
    const upsertRenderFormat = useVisualizations(s => s.upsertRenderFormat);
    const visualizations = useVisualizations(s => s.data);
    const [renderForm, setRenderForm] = useState<RenderForm>({
        chartType: "",
        renderFormat: null
    });
    const resultData = useVisualizations(s => s.resultData);

    const doSubmit = async () => {
        try {
            setLoading(true);
            await upsertRenderFormat(id, renderForm);
            onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleChartTypeChange = (chartType: string) => {

        if (chartType === "TABLE_VIEW") {
            setRenderForm(produce((draft) => {
                draft.chartType = chartType;
                draft.renderFormat = null;
            }))
        }

        if (chartType === "BAR_CHART") {
            setRenderForm(produce((draft) => {
                draft.chartType = chartType;
                draft.renderFormat = {
                    x: "",
                    y: ""
                };
            }))
        }

        if (chartType === "LINE_CHART") {
            setRenderForm(produce((draft) => {
                draft.chartType = chartType;
                draft.renderFormat = {
                    x: "",
                    y: ""
                };
            }))
        }

        if (chartType === "PIE_CHART") {
            setRenderForm(produce((draft) => {
                draft.chartType = chartType;
                draft.renderFormat = {
                    variable: "",
                    count: ""
                };
            }))
        }

        if (chartType === "KPI_VIEW") {
            setRenderForm(produce((draft) => {
                draft.chartType = chartType;
                draft.renderFormat = {
                    count: ""
                };
            }))
        }
    }


    const renderFormatForm = (chartType: string) => {
        if (chartType === "BAR_CHART") {

            return (
                <Box display="flex" flexDirection="column" gap={5}>
                    <FormControl>
                        <FormLabel>X</FormLabel>
                        <Select value={renderForm.renderFormat.x} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.x = e.target.value }))}>
                            <option value="">Choose X Co-Ordinate</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Y</FormLabel>
                        <Select value={renderForm.renderFormat.y} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.y = e.target.value }))}>
                            <option value="">Choose Y Co-Ordinate</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                </Box>
            )
        }

        if (chartType === "LINE_CHART") {
            return (
                <Box display="flex" flexDirection="column" gap={5}>
                    <FormControl>
                        <FormLabel>X</FormLabel>
                        <Select value={renderForm.renderFormat.x} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.x = e.target.value }))}>
                            <option value="">Choose X Co-Ordinate</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Y</FormLabel>
                        <Select value={renderForm.renderFormat.y} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.y = e.target.value }))}>
                            <option value="">Choose Y Co-Ordinate</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                </Box>
            )
        }

        if (chartType === "PIE_CHART") {
            return (
                <Box display="flex" flexDirection="column" gap={5}>
                    <FormControl>
                        <FormLabel>Variable</FormLabel>
                        <Select value={renderForm.renderFormat.variable} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.variable = e.target.value }))}>
                            <option value="">Choose a variable column</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Count Column</FormLabel>
                        <Select value={renderForm.renderFormat.count} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.count = e.target.value }))}>
                            <option value="">Choose a count column</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                </Box>
            )
        }

        if (chartType === "KPI_VIEW") {
            return (
                <Box display="flex" flexDirection="column" gap={5}>
                    <FormControl>
                        <FormLabel>Count Column</FormLabel>
                        <Select value={renderForm.renderFormat.count} onChange={e => setRenderForm(produce((draft) => { draft.renderFormat.count = e.target.value }))}>
                            <option value="">Choose a count column</option>
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return <option value={key} key={`rdk-${index}`}>{key}</option>
                            })}
                        </Select>
                    </FormControl>
                </Box>
            )
        }

        return <Box></Box>
    }

    useEffect(() => {
        let index = visualizations.findIndex(v => v.id === id);
        if (visualizations[index].render) {
            setRenderForm(produce((draft) => {
                draft.chartType = visualizations[index].render?.chartType as string;
                draft.renderFormat = visualizations[index].render?.format as any;
            }))
        }
    }, [])

    return (
        <Box>
            <ModalHeader>Render Format</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" gap={5}>
                <FormControl >
                    <FormLabel>Datasource</FormLabel>
                    <Select value={renderForm.chartType} onChange={e => handleChartTypeChange(e.target.value)}>
                        <option value="">Choose Chart Type</option>
                        <option disabled={Object.keys(resultData[0]).length < 2} value="BAR_CHART">Bar Chart</option>
                        <option disabled={Object.keys(resultData[0]).length < 2} value="LINE_CHART">Line Chart</option>
                        <option disabled={Object.keys(resultData[0]).length < 2} value="PIE_CHART">Pie Chart</option>
                        <option disabled={resultData.length !== 1} value="KPI_VIEW">KPI View</option>
                        <option value="TABLE_VIEW">Table View</option>
                    </Select>
                </FormControl>
                {renderFormatForm(renderForm.chartType)}
            </ModalBody>
            <ModalFooter>
                <Button type="button" variant="ghost" mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={loading} loadingText="Rendering" onClick={doSubmit} colorScheme="blue">Render</Button>
            </ModalFooter>
        </Box>
    )
}