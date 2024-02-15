import { Box } from "@chakra-ui/react";

export default function AuthBox(props: any) {
    return (
        <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center" background="#EBEBEB">
            <Box width={["100%", "100%", "500px", "500px"]} background="white" padding="2em" display="flex" flexDirection="column" gap={5}>{props.children}</Box>
        </Box>
    )
}
