import { Avatar, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { ChangePasswordForm, useAccounts } from "../../../data/accounts";
import { useForm } from "react-hook-form";
import { useState } from "react";

function ChangePassword(props: any) {
    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordForm>();
    const changePassword = useAccounts(act => act.changePassword);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const doSubmit = async (data: ChangePasswordForm) => {
        try {
            setLoading(true);
            await changePassword(data);
            props.onClose();
            toast({
                title: "Success",
                description: "Password changed successfully",
                duration: 1000,
                status: "success"
            })
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed",
                description: "Unable to update your pasword",
                duration: 1000,
                status: "error"
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(doSubmit)}>
                <ModalBody display="flex" flexDirection="column" gap={5}>
                    <FormControl isInvalid={errors.oldPassword ? true : false}>
                        <FormLabel>Old Password</FormLabel>
                        <Input type="password" placeholder="Enter your current password" {...register("oldPassword", { required: true })} />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.newPassword ? true : false}>
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" placeholder="Type a new password" {...register("newPassword", { required: true })} />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" loadingText="Updating" isLoading={loading} type="submit">Save</Button>
                </ModalFooter>
            </form>
        </Box>
    )
}

export default function User() {

    const name = useAccounts(act => act.name);
    const email = useAccounts(act => act.email);
    const logout = useAccounts(act => act.logout);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Container maxW="5xl" marginTop="1em">
            <Text fontSize="20px" fontWeight={600}>User</Text>
            <Flex marginTop="2em" shadow="sm" padding="1em" border="1px solid #EBEBEB" flexDirection="column" gap={3}>
                <Avatar name={name} />
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ChangePassword onClose={onClose} />
                    </ModalContent>
                </Modal>

                <Box>
                    <Text fontSize="20px">{name}</Text>
                    <Text fontSize="15px" fontWeight={500}>{email}</Text>
                </Box>
                <Flex gap={3}>
                    <Button onClick={onOpen}>Change Password</Button>
                    <Button onClick={logout} colorScheme="red">Logout</Button>
                </Flex>
            </Flex>
        </Container>
    )
}
