import { Box } from "@chakra-ui/react";
import { TbChartAreaFilled, TbSettingsFilled } from "react-icons/tb";
import { HiQuestionMarkCircle, HiDatabase } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

export default function AppBox(props: any) {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box display="flex" height="100vh" width="100vw">
            <Box border="1px solid #EBEBEB" width="70px" background="#fafafa" display="flex" flexDirection="column" justifyContent="space-between">
                <Box display="flex" flexDirection="column" paddingY="2em" gap={5} alignItems="center">
                    <Box><img src="/logo.svg" /></Box>
                    <Box
                        onClick={() => navigate("/admin/visualizations")}
                        rounded="md"
                        fontSize="22px"
                        padding="10px"
                        cursor="pointer"
                        color="#2e2e2e"
                        _hover={{ background: "#DBDBDB" }}
                        background={location.pathname === "/admin/visualizations" ? "#DBDBDB" : ""}
                    >
                        <TbChartAreaFilled />
                    </Box>

                    <Box
                        onClick={() => navigate("/admin/sources")}
                        rounded="md"
                        fontSize="22px"
                        padding="10px"
                        cursor="pointer"
                        color="#2e2e2e"
                        _hover={{ background: "#DBDBDB" }}
                        background={location.pathname === "/admin/sources" ? "#DBDBDB" : ""}
                    >
                        <HiDatabase />
                    </Box>

                    <Box
                        onClick={() => navigate("/admin/settings")}
                        rounded="md"
                        fontSize="22px"
                        padding="10px"
                        cursor="pointer"
                        color="#2e2e2e"
                        _hover={{ background: "#DBDBDB" }}
                        background={location.pathname === "/admin/settings" ? "#DBDBDB" : ""}
                    >
                        <TbSettingsFilled />
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" paddingY="2em" gap={5} alignItems="center">
                    <Box
                        rounded="md"
                        fontSize="22px"
                        padding="10px"
                        cursor="pointer"
                        color="#2e2e2e"
                        _hover={{ background: "#DBDBDB" }}
                    >
                        <HiQuestionMarkCircle />
                    </Box>
                </Box>
            </Box>
            <Box width="calc(100vw - 70px)">{props.children}</Box>
        </Box>
    )
}
