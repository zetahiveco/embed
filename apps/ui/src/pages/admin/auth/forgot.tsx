import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import AuthBox from "../../../components/authBox";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAccounts } from "../../../data/accounts";

export default function ForgotPassword() {

    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [sent, setSent] = useState(false);
    const forgotPassword = useAccounts(act => act.forgotPassword);


    const doSubmit = async (data: { email: string }) => {
        try {
            setLoading(true);
            await forgotPassword(data.email);
            toast({
                title: "Success",
                description: "Reset code sent to email",
                status: "success",
                duration: 1500
            });
            setSent(true);
        } catch (err) {
            toast({
                title: "Request Failed",
                description: "Unable to send email",
                status: "error",
                duration: 1500
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(doSubmit)}>
            <AuthBox>
                <Box marginBottom="1em">
                    <img src="/logo-text.png" width="100px" height="100%" />
                </Box>
                <FormControl isInvalid={errors.email ? true : false}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" {...register("email", { required: true })} placeholder="joe@superawesome.co" />
                </FormControl>
                <Button colorScheme="blue" isDisabled={sent} loadingText="Sending" isLoading={loading} type="submit">Send Code</Button>
            </AuthBox>
        </form>
    )
}
