import { Box, Button, Container, Flex, FormControl, FormLabel, Input, Modal, ModalContent, ModalOverlay, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";
import { IVisualization, VisualizationForm, useVisualizations } from "../../../data/visualizations";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSources } from "../../../data/sources";
import Editor from '@monaco-editor/react';
import { HiChartBar, HiChartPie, HiPlus, HiSave } from "react-icons/hi";
import { TbBrandPowershell } from "react-icons/tb";
import UpdateRenderFormat from "./updateRenderFormat";
import { Visualization as VisualizationElement } from "@embed/react";

export default function Visualization() {

    const visualizations = useVisualizations(s => s.data);
    const [currentVisualization, setCurrentVisualization] = useState("");
    const { register, setValue, getValues, formState: { errors } } = useForm<VisualizationForm>();

    const fetchVisualizations = useVisualizations(s => s.fetchVisualizations);
    const addVisualization = useVisualizations(s => s.addVisualization);
    const updateVisualization = useVisualizations(s => s.updateVisualization);
    const fetchVisualizationData = useVisualizations(s => s.fetchVisualizationData);

    const renderToken = useVisualizations(s => s.renderToken);

    const resultData = useVisualizations(s => s.resultData);
    const queryError = useVisualizations(s => s.queryError);
    const sources = useSources(s => s.sources);
    const fetchSources = useSources(s => s.fetchSources);
    const [saving, setSaving] = useState(false);
    const [renderFormatModal, setRenderFormatModal] = useState(false);

    const init = async () => {
        try {
            await fetchVisualizations();
            await fetchSources();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        if (currentVisualization && currentVisualization !== "new") {
            const vizIndex = visualizations.findIndex(viz => viz.id === currentVisualization);
            if (vizIndex > -1) {
                setValue("name", visualizations[vizIndex].name);
                setValue("datasource", visualizations[vizIndex].datasourceId);
                setValue("plainSql", visualizations[vizIndex].plainSql);
                saveAndRunVisualization(false);
            }
        }
        if (currentVisualization === "new") {
            setValue("name", "");
            setValue("datasource", "");
            setValue("plainSql", "");
        }
    }, [visualizations, currentVisualization])

    const saveAndRunVisualization = async (save: boolean = true) => {
        try {
            setSaving(true);
            if (save) {
                if (currentVisualization === "new") {
                    const id = await addVisualization(getValues());
                    setCurrentVisualization(id);
                } else {
                    await updateVisualization(currentVisualization, getValues());
                    await fetchVisualizationData(currentVisualization);
                }
            } else {
                await fetchVisualizationData(currentVisualization);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSaving(false);
        }
    }

    const getRenderFormat = () => {
        try {
            return visualizations[visualizations.findIndex(v => v.id === currentVisualization)].render;
        } catch (err) {
            return null;
        }
    }


    return (
        <AppBox>
            <Box display="flex" height="100%" width="100%">
                <Modal onClose={() => setRenderFormatModal(false)} isOpen={renderFormatModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <UpdateRenderFormat id={currentVisualization} onClose={() => setRenderFormatModal(false)} />
                    </ModalContent>
                </Modal>
                <Box display="flex" border="1px solid #EBEBEB" flexDirection="column" paddingX="1em" paddingY="1em" width="250px" height="100%" background="#f8f8f8">
                    <Button leftIcon={<HiPlus />} marginBottom="2em" onClick={() => setCurrentVisualization("new")} colorScheme="blue">Create Visualization</Button>
                    {visualizations.map((visualization: IVisualization, index: number) => {
                        return (
                            <Box
                                marginY="5px"
                                key={`viz-${index}`}
                                background={visualization.id === currentVisualization ? "#DBDBDB" : ""}
                                rounded="md"
                                paddingY="8px"
                                paddingX="1em"
                                display="flex"
                                cursor="pointer"
                                onClick={() => setCurrentVisualization(visualization.id)}
                                alignItems="center"
                                gap={2}
                            >
                                <HiChartBar />
                                <Text>{visualization.name}</Text>
                            </Box>
                        )
                    })}
                    {visualizations.length < 1 ? <Text fontSize="14px" marginTop="1em">No visualizations found</Text> : null}
                </Box>
                <Box width="calc(100% - 250px)" height="100%" overflowY="auto" overflowX="hidden">
                    <Container maxW="1200px" marginTop="1em" height="100%">
                        {currentVisualization ?
                            <Box>
                                <Flex alignItems="center" justifyContent="space-between">
                                    <Text fontSize="20px" fontWeight={600}>Visualization</Text>
                                    <Button isLoading={saving} loadingText="Saving" leftIcon={<HiSave />} onClick={() => saveAndRunVisualization()} colorScheme="blue">Save</Button>
                                </Flex>
                                <Flex flexDirection="column" gap={5} marginTop="2em">
                                    <FormControl isInvalid={errors.name ? true : false}>
                                        <FormLabel>Name</FormLabel>
                                        <Input {...register("name", { required: true })} placeholder="Enter name" />
                                    </FormControl>
                                    <FormControl isInvalid={errors.datasource ? true : false}>
                                        <FormLabel>Datasource</FormLabel>
                                        <Select {...register("datasource", { required: true })}>
                                            <option value="">Choose datasource</option>
                                            {sources.map((source: any, index: number) => {
                                                return <option key={`src-${index}`} value={source.id}>{source.name}</option>
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>SQL Query</FormLabel>
                                        <Box border="1px solid #EBEBEB">
                                            <Editor
                                                height="250px"
                                                defaultLanguage="sql"
                                                value={getValues("plainSql")}
                                                onChange={v => setValue("plainSql", v as string)}
                                            />
                                        </Box>
                                    </FormControl>
                                    <Box display="flex" marginTop="-1.5em">
                                        <Button isLoading={saving} loadingText="Running Query" leftIcon={<TbBrandPowershell />} onClick={() => saveAndRunVisualization()} marginTop="1em">Run Query</Button>
                                    </Box>
                                    {resultData.length > 0 ? <>
                                        <FormLabel>Sample Data</FormLabel>
                                        <Flex flexDirection="column" overflow="auto" maxH="250px" width="100%">
                                            <Table border="1px solid #EBEBEB">
                                                <Thead>
                                                    <Tr>
                                                        {Object.keys(resultData[0]).map((key: string, index: number) => {
                                                            return <Th key={`rdk-${index}`}>{key}</Th>
                                                        })}
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {resultData.slice(0, 10).map((row: any, rIndex: number) => {

                                                        return (
                                                            <Tr key={`rw-${rIndex}`}>
                                                                {Object.keys(row).map((column: string, cIndex: number) => {
                                                                    return <Td key={`clm-${cIndex}`}>{(typeof row[column] === 'object') ? JSON.stringify(row[column]) : row[column]}</Td>
                                                                })}
                                                            </Tr>
                                                        )
                                                    })}
                                                </Tbody>
                                            </Table>
                                        </Flex>
                                        <Box display="flex" marginBottom="2em" >
                                            <Button onClick={() => setRenderFormatModal(true)} leftIcon={<HiChartPie />}>Render Chart</Button>
                                        </Box>
                                        {getRenderFormat() ? <Box display="flex" marginBottom="2em" flexDirection="column" gap={2}>
                                            <FormLabel>Rendered Data</FormLabel>
                                            <Box height="500px" width="100%">
                                                <VisualizationElement 
                                                    id={currentVisualization}
                                                    server="http://localhost:8080"
                                                    token={renderToken}
                                                />
                                            </Box>
                                        </Box> : null}
                                    </> : null}
                                    {queryError ? <Box border="1px solid #EBEBEB" padding="1em" color="red">
                                        {JSON.stringify(queryError)}
                                    </Box> : null}

                                </Flex>
                            </Box>
                            : null}
                        {!currentVisualization ?
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                width="1200px"
                                height="100%"
                            >
                                <Text>{visualizations.length === 0 ? "Not found visualizations" : "Visualization not selected"}</Text>
                            </Box>
                            : null}
                    </Container>
                </Box>
            </Box>
        </AppBox>
    )
}
