import { Avatar, Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { useAccounts } from "../../../data/accounts";

export default function User() {

    const name = useAccounts(act => act.name);
    const email = useAccounts(act => act.email);

    return (
        <Container maxW="5xl" marginTop="1em">
            <Text fontSize="20px" fontWeight={600}>User</Text>
            <Flex marginTop="2em" shadow="sm" padding="1em" border="1px solid #EBEBEB" flexDirection="column" gap={3}>
                <Avatar name={name}/>
                <Box>
                    <Text fontSize="20px">{name}</Text>
                    <Text fontSize="15px" fontWeight={500}>{email}</Text>
                </Box>
                <Flex gap={3}>
                    <Button>Change Password</Button>
                    <Button colorScheme="red">Logout</Button>
                </Flex>
            </Flex>
        </Container>
    )
}
