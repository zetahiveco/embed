import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { InviteUserForm, useAccounts } from "../../../data/accounts";
import { useEffect, useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi";
import { useForm } from "react-hook-form";

function InviteUser(props: any) {
    const { register, handleSubmit, formState: { errors } } = useForm<InviteUserForm>();
    const inviteUser = useAccounts(act => act.inviteUser);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const doSubmit = async (data: InviteUserForm) => {
        try {
            setLoading(true);
            await inviteUser(data);
            toast({
                title: "Success",
                description: "Invite sent",
                duration: 1000,
                status: "success"
            })
            props.onClose();
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed",
                description: "Unable to send invite",
                duration: 1000,
                status: "error"
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <ModalHeader>Invite a user</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(doSubmit)}>
                <ModalBody display="flex" flexDirection="column" gap={5}>
                    <FormControl isInvalid={errors.email ? true : false}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Enter Email" {...register("email", { required: true })} />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.role ? true : false}>
                        <FormLabel>Role</FormLabel>
                        <Select {...register("role", { required: true })}>
                            <option value="">Choose a role</option>
                            <option value="MEMBER">User</option>
                            <option value="ADMIN">Admin</option>
                        </Select>
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" loadingText="Sending Email" isLoading={loading} type="submit">Invite User</Button>
                </ModalFooter>
            </form>
        </Box>
    )
}

export default function Organization() {

    const organizations = useAccounts(act => act.organizations);
    const currentOrg = useAccounts(act => act.currentOrganization);
    const switchOrg = useAccounts(act => act.switchOrganization);
    const members = useAccounts(act => act.members);
    const fetchMembers = useAccounts(act => act.fetchMembers);
    const userId = useAccounts(act => act.userId);

    const userInvites = useAccounts(act => act.userInvites);
    const fetchUserInvites = useAccounts(act => act.fetchUserInvites);
    const deleteUserInvite = useAccounts(act => act.removeInvite);
    const { isOpen, onOpen, onClose } = useDisclosure();


    useEffect(() => {
        fetchMembers();
        fetchUserInvites();
    }, [])

    const isMemberRemovable = (requestMember: string) => {
        if (requestMember !== userId) {
            const member = members.find(mem => mem.userId === userId);
            if (member && member.role === "ADMIN") {
                return true
            }
        }

        return false;
    }

    const isAdmin = () => {
        const member = members.find(mem => mem.userId === userId);
        if (member && member.role === "ADMIN") {
            return true
        }
        return false;
    }

    return (
        <Container maxW="5xl" marginTop="1em">
            <Text fontSize="20px" fontWeight={600}>Organizations</Text>
            <Flex marginTop="2em" shadow="sm" padding="1em" border="1px solid #EBEBEB" flexDirection="column" gap={3}>
                <FormControl>
                    <FormLabel>Current Organization</FormLabel>
                    <Select value={currentOrg} onChange={(e) => switchOrg(e.target.value)}>
                        {organizations.map((org, index) => {
                            return <option value={org.organizationId} key={`org-${index}`}>{org.organization.name}</option>
                        })}
                    </Select>
                </FormControl>
            </Flex>
            <Flex marginTop="4em" alignItems="center" justifyContent="space-between">
                <Text fontSize="20px" fontWeight={600}>Members</Text>
                <Button onClick={onOpen} leftIcon={<HiPlus />}>Invite User</Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <InviteUser onClose={onClose} />
                </ModalContent>
            </Modal>

            <Table marginTop="1em">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {members.map((member: any, index: number) => {
                        return (
                            <Tr key={`mem-${index}`}>
                                <Td>{member.user.name}</Td>
                                <Td>{member.user.email}</Td>
                                <Td>{member.role}</Td>
                                <Td>
                                    <Button isDisabled={!isMemberRemovable(member.userId)} leftIcon={<HiTrash />} colorScheme="red" variant="outline">Remove</Button>
                                </Td>
                            </Tr>
                        )
                    })}
                    {userInvites.map((invite: any, index: number) => {
                        return (
                            <Tr key={`inv-${index}`}>
                                <Td>-</Td>
                                <Td>{invite.email}</Td>
                                <Td>-</Td>
                                <Td>
                                    <Button onClick={() => deleteUserInvite(invite.id)} isDisabled={!isAdmin()} leftIcon={<HiTrash />} colorScheme="red" variant="outline">Remove</Button>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Container>
    )
}
