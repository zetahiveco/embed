import { useEffect, useState } from "react"
import Chart from "react-apexcharts";
import { css } from "@emotion/css";

interface VisualizationProps {
    id: string
    token: string
    server: string
}

export function Visualization(props: VisualizationProps) {

    const [resultData, setResultData] = useState<Array<any>>([]);
    const [renderFormat, setRenderFormat] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [options, setOptions] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${props.server}/api/v1/visualizations/${props.id}/public`, {
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${props.token}`
                }),
            });

            if (!res.ok) throw new Error(await res.text());

            const apiData = await res.json();

            setResultData(apiData.resultData);
            setRenderFormat(apiData.renderFormat);
        } catch (err) {
            setError(`unable to load`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [props.id])

    useEffect(() => {
        if (resultData.length > 0 && renderFormat) {
            if (renderFormat.chartType === "PIE_CHART") {
                const labels = [];
                const series = [];

                for (let obj of resultData) {
                    if (obj[renderFormat.format.variable] && obj[renderFormat.format.count]) {
                        labels.push(obj[renderFormat.format.variable]);
                        series.push(parseInt(obj[renderFormat.format.count]))
                    }
                }

                setOptions({
                    chart: {
                        type: "pie",
                        toolbar: {
                            show: false
                        }
                    },
                    series: series,
                    labels: labels,
                    responsive: [{
                        options: {
                            legend: {
                                position: "bottom"
                            }
                        }
                    }]
                })
            }

            if (renderFormat.chartType === "BAR_CHART") {
                const xData = [];
                const yData = [];

                for (let obj of resultData) {
                    if (obj[renderFormat.format.x] && obj[renderFormat.format.y]) {
                        xData.push(obj[renderFormat.format.x]);
                        yData.push(parseInt(obj[renderFormat.format.y]))
                    }
                }

                setOptions({
                    chart: {
                        type: "bar",
                        toolbar: {
                            show: false
                        }
                    },
                    series: [{
                        name: renderFormat.format.y,
                        data: yData
                    }],
                    xaxis: {
                        categories: xData
                    },
                    yaxis: {
                        title: {
                            text: renderFormat.format.y
                        }
                    }
                })
            }

            if (renderFormat.chartType === "LINE_CHART") {
                const xData = [];
                const yData = [];

                for (let obj of resultData) {
                    if (obj[renderFormat.format.x] && obj[renderFormat.format.y]) {
                        xData.push(obj[renderFormat.format.x]);
                        yData.push(parseInt(obj[renderFormat.format.y]))
                    }
                }

                setOptions({
                    chart: {
                        type: "line",
                        toolbar: {
                            show: false
                        }
                    },
                    series: [{
                        name: renderFormat.format.y,
                        data: yData
                    }],
                    xaxis: {
                        categories: xData
                    },
                    yaxis: {
                        title: {
                            text: renderFormat.format.y
                        }
                    }
                })
            }
        }
    }, [props.id, resultData, renderFormat])

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

    if (renderFormat && options && renderFormat.chartType === "BAR_CHART") {
        return (
            <div className={css`
                height: 100%;
                width: 100%;
            `}>
                <Chart
                    options={options}
                    series={options.series}
                    type="bar"
                    width="100%"
                    height="100%"
                />
            </div>
        )
    }

    if (renderFormat && options && renderFormat.chartType === "LINE_CHART") {
        return (
            <div className={css`
                height: 100%;
                width: 100%;
            `}>
                <Chart
                    options={options}
                    series={options.series}
                    type="line"
                    width="100%"
                    height="100%"
                />
            </div>
        )
    }

    if (renderFormat && options && renderFormat.chartType === "PIE_CHART") {
        return (
            <div className={css`
                height: 100%;
                width: 100%;
            `}>
                <Chart
                    options={options}
                    type="pie"
                    series={options.series}
                    width="100%"
                    height="100%"
                />
            </div>
        )
    }


    if (renderFormat && resultData.length > 0 && renderFormat.chartType === "KPI_VIEW") {
        return (
            <div
                className={css`
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <h3>{Object.keys(resultData[0])[0]}</h3>
                <h1>{resultData[0][Object.keys(resultData[0])[0]]}</h1>
            </div>
        )
    }


    if (renderFormat && renderFormat.chartType === "TABLE_VIEW") {
        return (
            <div
                className={css`
                    height: 100%;
                    width: 100%;
                    display: flex;
                    overflow: auto;
                    padding-right: 5px;
                    background: white;

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
                `}
            >
                <table
                    className={css`
                        background: white;
                        border-collapse: collapse;
                    `}
                >
                    <thead>
                        <tr
                            className={css`
                                width: 100%;
                                position: sticky;
                                background: #EBEBEB;
                                top: 0;
                                left: 0;
                            `}
                        >
                            {Object.keys(resultData[0]).map((key: string, index: number) => {
                                return (
                                    <th
                                        className={css`
                                            border: 1px solid #d3d3d3;
                                            border-collapse: collapse;
                                            padding: 1em;
                                        `}
                                        key={`th-${index}`}
                                    >
                                        {key}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {resultData.map((row: any, rindex: number) => {
                            return (
                                <tr
                                    key={`tr-${rindex}`}
                                    className={css`
                                        border: 1px solid #EBEBEB;
                                        border-collapse: collapse;
                                        :hover {
                                            background: #f1f1f1;
                                        }
                                    `}
                                >
                                    {Object.keys(row).map((column: string, cindex: number) => {
                                        return (
                                            <td
                                                className={css`
                                                    padding: 0.5em 2em 0.5em 2em;
                                                `}
                                                key={`td-${rindex}-${cindex}`}
                                            >
                                                {row[column]}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return <></>
}
