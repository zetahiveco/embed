import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";
import { HiUserCircle, HiOfficeBuilding } from "react-icons/hi";
import { useState } from "react";
import { IoKeySharp } from "react-icons/io5";
import { Secrets } from "./secrets";
import User from "./user";
import Organization from "./organization";

export default function Settings() {

    const [settingsToggle, setSettingsToggle] = useState<"user" | "organization" | "keys">("user");

    const renderSettings = () => {
        if (settingsToggle === "user") {
            return <User />
        }
        if (settingsToggle === "organization") {
            return <Organization />
        }
        if (settingsToggle === "keys") {
            return <Secrets />
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
                        background={settingsToggle === "user" ? "#DBDBDB" : ""}
                        rounded="md"
                        paddingY="8px"
                        paddingX="1em"
                        display="flex"
                        cursor="pointer"
                        onClick={() => setSettingsToggle("user")}
                        alignItems="center"
                        gap={2}
                    ><HiUserCircle fontSize="22px" />User</Box>
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
                    <Box
                        background={settingsToggle === "keys" ? "#DBDBDB" : ""}
                        rounded="md"
                        paddingY="8px"
                        paddingX="1em"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        cursor="pointer"
                        onClick={() => setSettingsToggle("keys")}
                    ><IoKeySharp fontSize="22px" />Secrets</Box>
                </Box>
                <Box width="calc(100% - 250px)">
                    {renderSettings()}
                </Box>
            </Box>
        </AppBox>
    )
}