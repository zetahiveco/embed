import { Box, Button } from "@chakra-ui/react";
import AppBox from "../../../components/appBox";

export default function Visualization() {
    return (
        <AppBox>
            <Box display="flex" height="100%" width="100%">
                <Box display="flex" border="1px solid #EBEBEB" flexDirection="column" paddingX="1em" paddingY="1em" width="250px" height="100%" background="#f8f8f8">
                    <Button colorScheme="blue">Create Visualization</Button>
                </Box>
                <Box>
                    
                    <h1>Visualization</h1>
                </Box>
            </Box>
        </AppBox>
    )
}