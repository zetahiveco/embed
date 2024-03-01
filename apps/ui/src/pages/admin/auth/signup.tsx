import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, useStatStyles, useToast } from "@chakra-ui/react";
import AuthBox from "../../../components/authBox";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAccounts } from "../../../data/accounts";
import { useState } from "react";

export default function Signup() {

    interface Form {
        name: string
        company: string
        email: string
        password: string
    }

    const { register, handleSubmit, formState: { errors } } = useForm<Form>();
    const signupRequest = useAccounts((s) => s.signup);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const doSubmit = async (data: Form) => {
        try {
            setLoading(true);
            await signupRequest(data.name, data.company, data.email, data.password);
            toast({
                title: "Account Created",
                description: "An account has been created sucessfully",
                status: "success",
                duration: 1500
            })
            navigate("/admin/auth/login");
        } catch (err) {
            console.log(err);
            toast({
                title: "Request Failed",
                description: "An user account already exists",
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
                <FormControl isInvalid={errors.name ? true : false}>
                    <FormLabel>Name</FormLabel>
                    <Input {...register("name", { required: true })} placeholder="Joe Doe" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.company ? true : false}>
                    <FormLabel>Company</FormLabel>
                    <Input {...register("company", { required: true })} placeholder="Superawesome" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email ? true : false}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email"  {...register("email", { required: true })} placeholder="joe@superawesome.co" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password ? true : false}>
                    <FormLabel>Password</FormLabel>
                    <Input {...register("password", { required: true })} type="password" placeholder="Your Password" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <Button colorScheme="blue" isLoading={loading} loadingText="Creating your account" type="submit">Create an account</Button>
                <Link style={{ textDecoration: "underline", color: "blue" }} to="/admin/auth/login">Have an account? Login Now</Link>
            </AuthBox>
        </form>
    )
}
