import { Button, Container, Flex, FormControl, FormLabel, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useAccounts } from "../../../data/accounts";
import { useEffect } from "react";
import { HiPlus, HiTrash } from "react-icons/hi";

export default function Organization() {

    const organizations = useAccounts(act => act.organizations);
    const currentOrg = useAccounts(act => act.currentOrganization);
    const switchOrg = useAccounts(act => act.switchOrganization);
    const members = useAccounts(act => act.members);
    const fetchMembers = useAccounts(act => act.fetchMembers);
    const userId = useAccounts(act => act.userId);

    useEffect(() => {
        fetchMembers();
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
                <Button leftIcon={<HiPlus />}>Invite User</Button>
            </Flex>
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
                </Tbody>
            </Table>
        </Container>
    )
}