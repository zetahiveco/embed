import { Box, Button, Container, Flex, Modal, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";
import NewSource from "./newSource";
import { useSources } from "../../../data/sources";
import { useEffect } from "react";
import { HiTrash } from "react-icons/hi";

export default function Sources() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const sources = useSources(s => s.sources);
    const fetchSources = useSources(s => s.fetchSources);

    useEffect(() => {
        fetchSources();
    }, [])

    return (
        <AppBox>
            <Container maxW="1200px" marginTop="1em">
                <Flex marginTop="2em" alignItems="center" justifyContent="space-between">
                    <Text fontSize="20px" fontWeight={600}>Datasources</Text>
                    <Button onClick={onOpen} colorScheme="blue">Connect Database</Button>
                </Flex>
                <Modal onClose={onClose} isOpen={isOpen}>
                    <ModalOverlay />
                    <ModalContent>
                        <NewSource onClose={onClose} />
                    </ModalContent>
                </Modal>
                <Box marginTop="1em" display="flex" flexWrap="wrap" gap={5}>
                    {sources.map((source: any, index: number) => {
                        return (
                            <Box width="250px" border="1px solid #EBEBEB" shadow="sm" rounded="md" background="#fdfdfd" padding="1.5em" display="flex" flexDirection="column" gap={3} key={`src-${index}`}>
                                <Text fontWeight={600} fontSize="21px">{source.name}</Text>
                                <Text marginTop="-1em" fontSize="13px">{source.integrationType.toLowerCase()}</Text>
                                <Text>{source.host}:{source.port}</Text>
                                <Button leftIcon={<HiTrash />} colorScheme="red" variant="outline">Delete</Button>
                            </Box>
                        )
                    })}
                </Box>
            </Container>
        </AppBox>
    )
}
