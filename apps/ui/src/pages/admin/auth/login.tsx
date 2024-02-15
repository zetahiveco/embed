import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, useToast } from "@chakra-ui/react";
import AuthBox from "../../../components/authBox";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAccounts } from "../../../data/accounts";
import { useState } from "react";

export default function Login() {

    interface Form {
        email: string
        password: string
    }

    const { register, handleSubmit, formState: { errors } } = useForm<Form>();
    const loginRequest = useAccounts((s) => s.login);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const doSubmit = async (data: Form) => {
        try {
            setLoading(true);
            await loginRequest(data.email, data.password);
            window.location.href = "/";
        } catch (err) {
            toast({
                title: "Request Failed",
                description: "Invalid email or password",
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
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password ? true : false}>
                    <FormLabel>Password</FormLabel>
                    <Input {...register("password", { required: true })} type="password" placeholder="Your Password" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <Button loadingText="Logging In" isLoading={loading} type="submit">Login</Button>
                <Box display="flex" gap={2}>
                    <Link style={{ textDecoration: "underline", color: "blue" }} to="/admin/auth/signup">Create your account now</Link>
                    <Link style={{ textDecoration: "underline", color: "blue" }} to="/admin/auth/forgot-password">Forgot Password</Link>
                </Box>
            </AuthBox>
        </form>
    )
}
