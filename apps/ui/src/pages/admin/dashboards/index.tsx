import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";
import { useEffect, useState } from "react";
import { HiPlus, HiSave } from "react-icons/hi";
import { useDashboards } from "../../../data/dashboards";
import { MdMonitorHeart } from "react-icons/md";
import { useForm } from "react-hook-form";

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
    const [currentDashboard, setCurrentDashboard] = useState("");
    const [createDashboardForm, setCreateDashboardForm] = useState(false);


    const fetchDashboards = useDashboards(s => s.fetchDashboards);

    const init = async () => {
        try {
            await fetchDashboards();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        init();
    }, [])

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

                    {dashboards.map((dashboard: any, index: number) => {
                        return (
                            <Box
                                marginY="5px"
                                key={`viz-${index}`}
                                background={dashboard.id === currentDashboard ? "#DBDBDB" : ""}
                                rounded="md"
                                paddingY="8px"
                                paddingX="1em"
                                display="flex"
                                cursor="pointer"
                                onClick={() => setCurrentDashboard(dashboard.id)}
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
                <Box width="calc(100% - 250px)" height="100%" overflowY="auto" overflowX="hidden">
                    <Container maxW="1200px" marginTop="1em" height="100%">

                    </Container>
                </Box>
            </Box>
        </AppBox>
    )
}
