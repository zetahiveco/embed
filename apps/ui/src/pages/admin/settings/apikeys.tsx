import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { CreateSecretForm, useSecrets } from "../../../data/secrets";
import { HiTrash, HiClipboardCopy, HiPlus } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function NewApiKeyForm(props: any) {

    const { register, handleSubmit, formState: { errors } } = useForm<CreateSecretForm>();
    const [loading, setLoading] = useState(false);
    const createSecret = useSecrets(s => s.createSecret);

    const doSubmit = (data: CreateSecretForm) => {
        try {
            setLoading(true);
            createSecret(data);
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

export function ApiKeys() {

    const secrets = useSecrets(s => s.secrets);
    const fetchSecrets = useSecrets(s => s.getSecrets);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        fetchSecrets();
    }, [])

    return (
        <Container maxW="5xl" marginTop="1em">
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="20px" fontWeight={600}>Api Keys</Text>
                <Button leftIcon={<HiPlus />} colorScheme="blue" onClick={onOpen}>New Key</Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <NewApiKeyForm onClose={onClose} />
                </ModalContent>
            </Modal>
            <Flex flexDirection="column" gap={3} marginTop="1em">
                {secrets.map((secret, index) => {
                    return (
                        <Flex key={`set-${index}`} alignItems="center" gap={3} paddingY="1em" paddingX="1em" border="1px solid #EBEBEB" rounded="md">
                            <Text minW="100px" fontWeight={500}>{secret.name}</Text>
                            <Input width="100%" disabled value={secret.apiKey} />
                            <Button width="150px" leftIcon={<HiClipboardCopy />}>Copy</Button>
                            <Button width="150px" colorScheme="red" variant="outline" leftIcon={<HiTrash />}>Delete</Button>
                        </Flex>
                    )
                })}
            </Flex>
        </Container>
    )
}
