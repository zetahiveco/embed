import { Box } from "@chakra-ui/react";
import { useAccounts } from "../data/accounts";
import { useEffect, useState } from "react";
import Loader from "../components/loader";

export default function SessionProvider(props: any) {

    const [loading, setLoading] = useState(true);

    const fetchUserData = useAccounts(s => s.fetchUserData);
    const fetchOrganizations = useAccounts(s => s.fetchOrganizations);

    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        try {
            await fetchUserData();
            await fetchOrganizations();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />
    }

    return <Box>{props.children}</Box>
}
