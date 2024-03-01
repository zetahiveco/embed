import { useForm } from "react-hook-form";
import AuthBox from "../../../components/authBox";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useAccounts } from "../../../data/accounts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {

    interface ResetForm {
        email: string
        password: string
        otp: string
    }

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResetForm>();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const resetPassword = useAccounts(act => act.resetPassword);
    const navigate = useNavigate();

    useEffect(() => {
        const data = new URLSearchParams(window.location.search);
        setValue("email", data.get("email") || "");
        setValue("otp", data.get("otp") || "");
    }, [])

    const doSubmit = async (data: ResetForm) => {
        try {
            setLoading(true);
            await resetPassword(data);
            toast({
                title: "Success",
                description: "Password Updated",
                status: "success",
                duration: 1500
            });
            navigate("/admin/auth/login");
        } catch (err) {
            toast({
                title: "Request Failed",
                description: "Unable to reset password",
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
                <FormControl isInvalid={errors.email ? true : false}>
                    <FormLabel>Email</FormLabel>
                    <Input isDisabled={true} type="email" {...register("email", { required: true })} placeholder="joe@superawesome.co" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password ? true : false}>
                    <FormLabel>Password</FormLabel>
                    <Input {...register("password", { required: true })} type="password" placeholder="Your Password" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <Button colorScheme="blue" loadingText="Updating" isLoading={loading} type="submit">Change Password</Button>

            </AuthBox>
        </form>
    )
}
