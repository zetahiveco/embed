import { useEffect, useState } from "react";
import AuthBox from "../../../components/authBox";
import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useAccounts } from "../../../data/accounts";
import { produce } from "immer";

export default function AcceptInvite() {

    const [details, setDetails] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        otp: "",
        isNewUser: ""
    });

    const acceptInvite = useAccounts(act => act.acceptInvite);

    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const data = new URLSearchParams(window.location.search);
        setDetails({
            id: data.get("inviteId") || "",
            email: data.get("email") || "",
            name: "",
            otp: data.get("otp") || "",
            password: "",
            isNewUser: data.get("isNewUser") || ""
        })
    }, [])

    const onAccept = async () => {
        try {
            setLoading(true);
            await acceptInvite(details);
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed",
                description: "Invite has been expired",
                duration: 1000,
                status: "error"
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthBox>
            <Box marginBottom="1em">
                <img src="/logo-text.png" width="100px" height="100%" />
            </Box>
            <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={details.email} isDisabled />
            </FormControl>
            {details.isNewUser === "true" ?
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" value={details.name} onChange={(e) => setDetails(produce((draft) => { draft.name = e.target.value }))} placeholder="John Joe" />
                </FormControl>
                : null}
            {details.isNewUser === "true" ?
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={details.password} onChange={(e) => setDetails(produce((draft) => { draft.password = e.target.value }))} placeholder="Enter a password" />
                </FormControl>
                : null}
            <Button colorScheme="blue" isLoading={loading} onClick={onAccept} loadingText="Joining" type="submit">Accept Invite</Button>
        </AuthBox>
    )
}
