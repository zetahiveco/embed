import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Select } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateSourceForm, useSources } from "../../../data/sources";

export default function NewSource(props: any) {


    const { register, handleSubmit, formState: { errors } } = useForm<CreateSourceForm>();
    const [loading, setLoading] = useState(false);
    const insertSource = useSources(s=>s.insertSource);

    const doSubmit = async (data: CreateSourceForm) => {
        try {
            setLoading(true);
            await insertSource(data);
            props.onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(doSubmit)}>
            <ModalHeader>Connect Datasource</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" gap={5}>
                <FormControl isInvalid={errors.name ? true : false}>
                    <FormLabel>Name</FormLabel>
                    <Input {...register("name", { required: true })} placeholder="Enter a name" />
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.integration_type ? true : false}>
                    <FormLabel>Datasource</FormLabel>
                    <Select {...register("integration_type", { required: true })}>
                        <option value="">Choose datasource</option>
                        <option value="POSTGRESQL">Postgres</option>
                        <option value="MYSQL">MySQL</option>
                        <option value="SQL_SERVER">SQLServer</option>
                    </Select>
                    <FormErrorMessage>This field is required</FormErrorMessage>
                </FormControl>
                <Box display="flex" flexDirection="column" gap={5}>
                    <FormControl isInvalid={errors.database ? true : false}>
                        <FormLabel>Database</FormLabel>
                        <Input {...register("database", { required: true })} placeholder="Enter your database name" />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                    <Box display="flex" gap={2} alignItems="center">
                        <FormControl width="65%" isInvalid={errors.host ? true : false}>
                            <FormLabel>Host</FormLabel>
                            <Input {...register("host", { required: true })} placeholder="Enter host url" />
                            <FormErrorMessage>This field is required</FormErrorMessage>
                        </FormControl>
                        <FormControl width="35%" isInvalid={errors.port ? true : false}>
                            <FormLabel>Port</FormLabel>
                            <Input {...register("port", { required: true })} placeholder="Enter port" />
                            <FormErrorMessage>This field is required</FormErrorMessage>
                        </FormControl >
                    </Box>
                    <FormControl isInvalid={errors.username ? true : false}>
                        <FormLabel>Username</FormLabel>
                        <Input {...register("username", { required: true })} placeholder="Enter username" />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.password ? true : false}>
                        <FormLabel>Password</FormLabel>
                        <Input {...register("password", { required: true })} type="password" placeholder="Enter password" />
                        <FormErrorMessage>This field is required</FormErrorMessage>
                    </FormControl>
                </Box>
            </ModalBody>
            <ModalFooter>
                <Button type="button" variant="ghost" mr={3} onClick={props.onClose}>
                    Close
                </Button>
                <Button isLoading={loading} loadingText="Connecting" type="submit" colorScheme="blue">Connect</Button>
            </ModalFooter>
        </form>
    )
}
