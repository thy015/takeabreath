import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useMediaQuery } from 'react-responsive';
function valueFormatter(value) {
    return `${value} VNĐ`;
}


export default function ChartRevenue({ dataset }) {
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const chartSetting = {
        yAxis: [
            {
                label: 'VNĐ'
            },
        ],
        width:isMobile ? 400: 900,
        height: 300,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: isMobile? 'translate(-10px, 0)':'translate(-60px, 0)',
            },
        },
    };
    return (
        <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[
                { dataKey: 'revenue', label: 'Tổng doanh thu', valueFormatter },
            ]}
            {...chartSetting}
        />

    );
}