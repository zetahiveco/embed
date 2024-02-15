import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";
import { HiUserCircle, HiOfficeBuilding } from "react-icons/hi";
import { useState } from "react";

function Users() {
    return (
        <Box></Box>
    )
}

function Organization() {
    return (
        <Box></Box>
    )
}

export default function Settings() {

    const [settingsToggle, setSettingsToggle] = useState<"users" | "organization">("users");

    const renderSettings = () => {
        if (settingsToggle === "users") {
            return <Users />
        }
        if (settingsToggle === "organization") {
            return <Organization />
        }
    }

    return (
        <AppBox>
            <Box display="flex" height="100%" width="100%">
                <Box display="flex" border="1px solid #EBEBEB" flexDirection="column" gap={3} paddingX="1em" paddingY="2em" width="250px" height="100%" background="#f8f8f8">
                    <Flex alignItems="center" gap={3}>
                        <Text fontWeight={500}>Settings</Text>
                        <Divider />
                    </Flex>
                    <Box
                        background={settingsToggle === "users" ? "#DBDBDB" : ""}
                        rounded="md"
                        paddingY="8px"
                        paddingX="1em"
                        display="flex"
                        cursor="pointer"
                        onClick={() => setSettingsToggle("users")}
                        alignItems="center"
                        gap={2}
                    ><HiUserCircle fontSize="22px" />Users</Box>
                    <Box
                        background={settingsToggle === "organization" ? "#DBDBDB" : ""}
                        rounded="md"
                        paddingY="8px"
                        paddingX="1em"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        cursor="pointer"
                        onClick={() => setSettingsToggle("organization")}
                    ><HiOfficeBuilding fontSize="22px" />Organization</Box>
                </Box>
                <Box>
                    {renderSettings()}
                </Box>
            </Box>
        </AppBox>
    )



}