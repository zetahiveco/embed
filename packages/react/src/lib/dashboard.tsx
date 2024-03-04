import { useEffect, useState } from "react";
import { Visualization } from "..";
import { css } from "@emotion/css";

interface DashboardProps {
    id: string
    server: string
    token: string
}

export function Dashboard(props: DashboardProps) {

    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${props.server}/api/v1/dashboards/${props.id}/public`,
                {
                    method: "GET",
                    headers: new Headers({
                        Authorization: `Bearer ${props.token}`
                    })
                }
            )
            const json = await res.json();
            if (!res.ok) {
                throw new Error(await res.text());
            }
            setDashboard(json);
        } catch (err) {
            setError("unable to load dashboard");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div
                className={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                `}>
                <p>Loading...</p>
            </div>
        )
    }

    if (!loading && error) {
        return (
            <div
                className={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                `}>
                <p>{error}</p>
            </div>
        )
    }

    if (dashboard) {

        return (
            <div className={css`
                height: 100vh;
                width: 100%;
                overflow: auto;
                
                ::-webkit-scrollbar {
                    width: 10px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 5px;
                }

                ::-webkit-scrollbar-thumb {
                    background: #dbdbdb;
                    border-radius: 5px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #d3d3d3;
                }
            
            `}>
                {dashboard.layout.map((row: any, rindex: number) => {
                    return (
                        <div
                            key={`rw-${rindex}`}
                            className={css`
                                display: flex;
                                width: calc(100% - 2em);
                                margin: 1em;
                                flex-direction: column;
                            `}
                        >
                            <h1>{row.title}</h1>
                            <div
                                className={css`
                                    display: flex;
                                    height: ${row.height};
                                    width: 100%;
                                    gap: 1em;
                                    flex-direction: row;
                                `}
                            >
                                {row.columns.map((column: any, cindex: number) => {
                                    return (
                                        <div
                                            className={css`
                                                display: flex;
                                                width: ${column.width};
                                            `}
                                            key={`rw-${rindex}-cl-${cindex}`}
                                        >
                                            <div
                                                className={css`
                                                    width: 100%;
                                                    box-shadow: 0px 1px 1px #ececec;
                                                    border: 1px solid #EBEBEB;
                                                    padding: 1em;
                                                `}
                                            >
                                                <h3 className={css`
                                                    height: 2em;
                                                `}>{column.title}</h3>
                                                <div
                                                    className={css`
                                                        height: calc(100% - 3em);
                                                    `}
                                                >
                                                <Visualization
                                                    id={column.visualizationId}
                                                    server={props.server}
                                                    token={props.token}
                                                />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return <></>
}
