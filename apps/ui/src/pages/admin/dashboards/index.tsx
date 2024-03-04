import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";
import { useEffect, useRef, useState } from "react";
import { HiPlus, HiSave, HiTrash } from "react-icons/hi";
import { useDashboards } from "../../../data/dashboards";
import { MdMonitorHeart } from "react-icons/md";
import { useForm } from "react-hook-form";
import { Visualization } from "@embed/react";
import { useVisualizations } from "../../../data/visualizations";
import { produce } from "immer";

function CreateDashboard(props: any) {
    const { register, handleSubmit, formState: { errors } } = useForm<{ name: string }>();
    const [loading, setLoading] = useState(false);
    const createDashboard = useDashboards(s => s.createDashboard);

    const doSubmit = async (data: { name: string }) => {
        try {
            setLoading(true);
            await createDashboard(data.name);
            props.onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <ModalHeader>Create Dashboard</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(doSubmit)}>
                <ModalBody display="flex" flexDirection="column" gap={5}>
                    <FormControl isInvalid={errors.name ? true : false}>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder="Enter a name" {...register("name", { required: true })} />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" leftIcon={<HiSave />} loadingText="Creating" isLoading={loading} type="submit">Save</Button>
                </ModalFooter>
            </form>
        </Box>
    )

}

export default function Dashboards() {

    const dashboards = useDashboards(s => s.dashboards);
    const visualizations = useVisualizations(s => s.data);
    const [currentDashboard, setCurrentDashboard] = useState<any>(null);
    const [createDashboardForm, setCreateDashboardForm] = useState(false);
    const [addVisualizationForm, setAddVisualizationForm] = useState({ open: false, row: -1 });
    const fetchDashboards = useDashboards(s => s.fetchDashboards);
    const fetchVisualizations = useVisualizations(s => s.fetchVisualizations);
    const [chartNew, setChartNew] = useState({
        name: "",
        visualizationId: ""
    });
    const updateDashboard = useDashboards(dsh => dsh.updateDashboard);
    const renderToken = useDashboards(dsh => dsh.renderToken);
    const pendingUpdate = useRef(true);

    const initialMouse = useRef(0);
    const initialPosition = useRef(0);
    const dashboardContainer = useRef<HTMLDivElement | null>(null);

    const init = async () => {
        try {
            await fetchDashboards();
            await fetchVisualizations();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        if (currentDashboard && pendingUpdate.current === true) {
            doUpdate();
        }
    }, [currentDashboard])


    const doUpdate = async () => {
        await updateDashboard(currentDashboard.name, currentDashboard.id, currentDashboard.layout);
        pendingUpdate.current = false;
    }

    const addRow = async () => {
        setCurrentDashboard(produce((draft: any) => {
            draft.layout.push({
                title: "",
                height: "250px",
                columns: []
            })
        }))
        pendingUpdate.current = true;
    }

    const addVisualizationToDashboard = async () => {
        setCurrentDashboard(produce((draft: any) => {
            draft.layout[addVisualizationForm.row].columns.push({
                title: chartNew.name,
                width: "30%",
                visualizationId: chartNew.visualizationId
            })
        }))

        setAddVisualizationForm({ open: false, row: -1 });
        pendingUpdate.current = true;
    }

    const deleteVisualization = async (rindex: number, cindex: number) => {
        setCurrentDashboard(produce((draft: any) => {
            draft.layout[rindex].columns.splice(cindex, 1);
        }))
        pendingUpdate.current = true;
    }


    const handleRepositionRow = (index: number, value: number) => {
        if (value !== 0) {
            let dragValue = value - initialMouse.current;

            let calculatedValue = initialPosition.current + dragValue;
            if (calculatedValue >= 10) {
                setCurrentDashboard(produce((draft: any) => {
                    draft.layout[index].height = `${initialPosition.current + (dragValue)}px`;
                }))
            }
        }
    }

    const handleRepositionColumn = (rowIndex: number, columnIndex: number, value: number) => {
        if (value !== 0) {
            let dragValue = value - initialMouse.current;
            if (dashboardContainer.current) {
                dragValue = (dragValue / dashboardContainer.current.offsetWidth) * 100;
            }
            let calculatedValue = initialPosition.current + (dragValue);
            if (calculatedValue <= 100 && calculatedValue >= 10) {
                setCurrentDashboard(produce((draft: any) => {
                    draft.layout[rowIndex].columns[columnIndex].width = `${initialPosition.current + (dragValue)}%`;
                }))
            }
        }
    }

    return (
        <AppBox>
            <Box display="flex" height="100%" width="100%">
                <Box display="flex" border="1px solid #EBEBEB" flexDirection="column" paddingX="1em" paddingY="1em" width="250px" height="100%" background="#f8f8f8">
                    <Button leftIcon={<HiPlus />} marginBottom="1em" onClick={() => setCreateDashboardForm(true)} colorScheme="blue">Create Dashboard</Button>
                    <Modal isOpen={createDashboardForm} onClose={() => setCreateDashboardForm(false)}>
                        <ModalOverlay />
                        <ModalContent>
                            <CreateDashboard onClose={() => setCreateDashboardForm(false)} />
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={addVisualizationForm.open} onClose={() => setAddVisualizationForm({ open: false, row: -1 })}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Add Chart</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody display="flex" flexDirection="column" gap={5}>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input placeholder="Enter a name" value={chartNew.name} onChange={(e) => setChartNew(produce((draft) => { draft.name = e.target.value }))} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Visualization</FormLabel>
                                    <Select value={chartNew.visualizationId} onChange={(e) => setChartNew(produce((draft) => { draft.visualizationId = e.target.value }))}>
                                        <option value="">Choose Visualization</option>
                                        {visualizations.map((visualization, index) => {
                                            return <option value={visualization.id} key={`vi-slt-${index}`}>{visualization.name}</option>
                                        })}
                                    </Select>
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={addVisualizationToDashboard} colorScheme="blue" leftIcon={<HiPlus />}>Add to dashboard</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {dashboards.map((dashboard: any, index: number) => {
                        return (
                            <Box
                                marginY="5px"
                                key={`viz-${index}`}
                                background={currentDashboard && dashboard.id === currentDashboard.id ? "#DBDBDB" : ""}
                                rounded="md"
                                paddingY="8px"
                                paddingX="1em"
                                display="flex"
                                cursor="pointer"
                                onClick={() => setCurrentDashboard(dashboard)}
                                alignItems="center"
                                gap={2}
                            >
                                <MdMonitorHeart />
                                <Text>{dashboard.name}</Text>
                            </Box>
                        )
                    })}
                    {dashboards.length < 1 ? <Text fontSize="14px" marginTop="0.5em">No dashboards found</Text> : null}
                </Box>
                <Box width="calc(100% - 250px)" padding="1em" height="100%" overflowY="auto" overflowX="hidden">
                    {currentDashboard ?
                        <Flex flexDirection="column" height="100%" width="100%" gap={2}>
                            {currentDashboard.layout && currentDashboard.layout.map((row: any, rindex: number) => {
                                return (
                                    <Flex key={`rw-${rindex}`} flexDirection="column" width="100%" ref={dashboardContainer}>
                                        <Text>{row.title}</Text>
                                        <Flex height={row.height} width="100%" flexDirection="row">
                                            {row.columns.map((column: any, cindex: number) => {
                                                return (
                                                    <Flex key={`rw-${rindex}-cl-${cindex}`} width={`calc(${column.width} + 40px)`}>
                                                        <Box width="calc(100% - 40px)" shadow="sm" padding="1em" border="1px solid #EBEBEB" >
                                                            <Flex justifyContent="space-between" alignItems="center" height="3em">
                                                                <Text fontSize="17px" fontWeight={600}>{column.title}</Text>
                                                                <Flex>
                                                                    <IconButton
                                                                        size="sm"
                                                                        onClick={() => deleteVisualization(rindex, cindex)}
                                                                        aria-label="delete-visualization"
                                                                        icon={<HiTrash />}
                                                                    />
                                                                </Flex>
                                                            </Flex>
                                                            <Box height="calc(100% - 4em)">
                                                                <Visualization
                                                                    id={column.visualizationId}
                                                                    server="http://localhost:8080"
                                                                    token={renderToken}
                                                                />
                                                            </Box>
                                                        </Box>
                                                        <Flex
                                                            onDragStart={(e) => {
                                                                initialMouse.current = e.clientX;
                                                                initialPosition.current = parseInt(column.width.split(`%`)[0])
                                                            }}
                                                            onDrag={(e) => handleRepositionColumn(rindex, cindex, e.clientX)}
                                                            onDragEnd={() => {
                                                                initialMouse.current = 0;
                                                                initialPosition.current = 0;
                                                                pendingUpdate.current = true;
                                                            }}
                                                            height="100%"
                                                            alignItems="center"
                                                            width="40px"
                                                            justifyContent="center"
                                                        >
                                                            <Box
                                                                cursor="w-resize"
                                                                width="5px"
                                                                height="100px"
                                                                background="#EBEBEB"
                                                                rounded="md"
                                                            />
                                                        </Flex>
                                                    </Flex>
                                                )
                                            })}
                                            <Flex alignItems="center" justifyContent="center" border="1px dotted #EBEBEB" height="100%" width="80px">
                                                <IconButton
                                                    onClick={() => setAddVisualizationForm({ open: true, row: rindex })}
                                                    aria-label="add-element"
                                                    icon={<HiPlus />}
                                                />
                                            </Flex>
                                        </Flex>
                                        <Flex
                                            onDragStart={(e) => {
                                                initialMouse.current = e.clientY;
                                                initialPosition.current = parseInt(row.height.split(`px`)[0])
                                            }}
                                            onDrag={(e) => handleRepositionRow(rindex, e.clientY)}
                                            onDragEnd={() => {
                                                initialMouse.current = 0;
                                                initialPosition.current = 0;
                                                pendingUpdate.current = true;
                                            }}
                                            width="100%"
                                            justifyContent="center"
                                            marginTop="10px"
                                            height="40px"
                                        >
                                            <Box
                                                cursor="n-resize"
                                                height="5px"
                                                width="150px"
                                                background="#EBEBEB"
                                                rounded="md" />
                                        </Flex>
                                    </Flex>
                                )
                            })}
                            <Flex alignItems="center" justifyContent="center" width="100%" paddingY="1em" border="1px dotted #EBEBEB">
                                <Button onClick={addRow} leftIcon={<HiPlus />}>Add Row</Button>
                            </Flex>
                        </Flex> : null}
                    {!currentDashboard ?
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                            height="100%"
                        >
                            <Text>{dashboards.length === 0 ? "Not found dashboards" : "Dashboard not selected"}</Text>
                        </Box>
                        : null}
                </Box>
            </Box>
        </AppBox >
    )
}
