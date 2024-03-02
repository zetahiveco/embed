import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from "@chakra-ui/react";
import { CreateKeyForm, TestVariableForm, useSecrets } from "../../../data/secrets";
import { HiTrash, HiClipboardCopy, HiPlus } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function NewApiKeyForm(props: any) {

    const { register, handleSubmit, formState: { errors } } = useForm<CreateKeyForm>();
    const [loading, setLoading] = useState(false);
    const createKey = useSecrets(s => s.createKey);

    const doSubmit = async (data: CreateKeyForm) => {
        try {
            setLoading(true);
            await createKey(data);
            props.onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <ModalHeader>Create API Key</ModalHeader>
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
                    <Button loadingText="Creating" isLoading={loading} type="submit">Create Key</Button>
                </ModalFooter>
            </form>
        </Box>
    )
}

function NewTestVariableForm(props: any) {

    const { register, handleSubmit, formState: { errors } } = useForm<TestVariableForm>();
    const [loading, setLoading] = useState(false);
    const createTestVariable = useSecrets(s => s.createTestVariable);

    const doSubmit = async (data: TestVariableForm) => {
        try {
            setLoading(true);
            await createTestVariable(data);
            props.onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <ModalHeader>Create Test Variable</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(doSubmit)}>
                <ModalBody display="flex" flexDirection="column" gap={5}>
                    <FormControl isInvalid={errors.name ? true : false}>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder="Enter a name" {...register("name", { required: true })} />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.type ? true : false}>
                        <FormLabel>Type</FormLabel>
                        <Select {...register("type", { required: true })}>
                            <option value="">Choose Type</option>
                            <option value="string">String</option>
                            <option value="int">Int</option>
                            <option value="boolean">Boolean</option>
                        </Select>
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.value ? true : false}>
                        <FormLabel>Value</FormLabel>
                        <Input placeholder="Enter a value" {...register("value", { required: true })} />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button loadingText="Creating" isLoading={loading} type="submit">Create Key</Button>
                </ModalFooter>
            </form>
        </Box>
    )
}

export function Secrets() {

    const keys = useSecrets(s => s.keys);
    const testVariables = useSecrets(s => s.testVariables);
    const fetchKeys = useSecrets(s => s.getKeys);
    const fetchTestVariables = useSecrets(s => s.getTestVariables);
    const [apiKeyForm, setApiKeyForm] = useState(false);
    const [testVariableForm, setTestVariableForm] = useState(false);
    const deleteTestVariable = useSecrets(s => s.deleteTestVariable);
    const deleteApiKey = useSecrets(s => s.deleteKey);

    useEffect(() => {
        fetchKeys();
        fetchTestVariables();
    }, [])

    return (
        <Container maxW="5xl" marginTop="1em">
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="20px" fontWeight={600}>Api Keys</Text>
                <Button leftIcon={<HiPlus />} colorScheme="blue" onClick={() => setApiKeyForm(true)}>New Key</Button>
            </Flex>
            <Modal isOpen={apiKeyForm} onClose={() => setApiKeyForm(false)}>
                <ModalOverlay />
                <ModalContent>
                    <NewApiKeyForm onClose={() => setApiKeyForm(false)} />
                </ModalContent>
            </Modal>
            <Modal isOpen={testVariableForm} onClose={() => setTestVariableForm(false)}>
                <ModalOverlay />
                <ModalContent>
                    <NewTestVariableForm onClose={() => setTestVariableForm(false)} />
                </ModalContent>
            </Modal>
            <Flex flexDirection="column" gap={3} marginTop="1em">
                {keys.map((apiKey, index) => {
                    return (
                        <Flex key={`set-${index}`} alignItems="center" gap={3} paddingY="1em" paddingX="1em" border="1px solid #EBEBEB" rounded="md">
                            <Text minW="100px" maxW="auto" fontWeight={500}>{apiKey.name}</Text>
                            <Input width="100%" isDisabled value={apiKey.apiKey} />
                            <Button onClick={() => navigator.clipboard.writeText(apiKey.apiKey)} width="150px" leftIcon={<HiClipboardCopy />}>Copy</Button>
                            <Button onClick={() => deleteApiKey(apiKey.apiKey)} width="150px" colorScheme="red" variant="outline" leftIcon={<HiTrash />}>Delete</Button>
                        </Flex>
                    )
                })}
            </Flex>
            <Flex marginTop="5em" justifyContent="space-between" alignItems="center">
                <Text fontSize="20px" fontWeight={600}>Test Variables</Text>
                <Button leftIcon={<HiPlus />} colorScheme="blue" onClick={() => setTestVariableForm(true)}>New Variable</Button>
            </Flex>
            <Flex flexDirection="column" gap={3} marginTop="1em">
                {testVariables.map((variable, index) => {
                    return (
                        <Flex key={`set-${index}`} alignItems="center" gap={3} paddingY="1em" paddingX="1em" border="1px solid #EBEBEB" rounded="md">
                            <Text fontWeight={500}>{variable.name}</Text>
                            <Text fontWeight={500}>{variable.type}</Text>
                            <Input width="100%" isDisabled value={variable.value} />
                            <Button onClick={() => deleteTestVariable(variable.id)} width="150px" colorScheme="red" variant="outline" leftIcon={<HiTrash />}>Delete</Button>
                        </Flex>
                    )
                })}
            </Flex>
        </Container>
    )
}
