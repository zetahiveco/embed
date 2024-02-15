import { Box, Spinner } from "@chakra-ui/react";

export default function Loader() {
    return (
        <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
            <Spinner />
        </Box>
    )
}