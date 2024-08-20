import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the necessary components and the datalabels plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title,
    ChartDataLabels
);

// Custom plugin to add transparency above Liter information
const transparencyPlugin = {
    id: 'transparencyPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const datasets = chart.data.datasets;

        datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
                const { y: barTop } = bar; // Top position of the bar
                const literPosition = chart.scales.y.getPixelForValue(dataset.data[index] * 0.50); // Adjust this factor to match your desired Liter level
                
                ctx.save();
                ctx.globalAlpha = 0; // Set transparency level
                ctx.fillStyle = bar.options.backgroundColor;
                ctx.fillRect(bar.x - bar.width / 2, barTop, bar.width, literPosition - barTop);
                ctx.restore();
            });
        });
    }
};

function ChartDisplay({ chartData }) {
    const { data, currency } = chartData;

    // Sort data by Price in ascending order
    const sortedData = data.sort((a, b) => a.Price - b.Price);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true, // You can choose to enable or disable tooltips
            },
            datalabels: {
                display: true,
                align: 'center', // Centers the text horizontally
                anchor: 'center', // Centers the text vertically
                color: 'white',
                offset: 0, // Ensures the text is not offset from the center
                formatter: function(value, context) {
                    const index = context.dataIndex;
                    const liters = context.dataset.liters[index];
                    const dimensions = context.dataset.dimensions[index];
                    const salesUnits = context.dataset.salesUnits[index];
                    return `${liters} L\n${dimensions}\n${salesUnits} units\n${value} ${currency}`;
                },
                font: {
                    size: 12,
                },
                textAlign: 'center', // Ensures that each line of text is centered
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: sortedData.map(item => item.Model),
                title: {
                    display: true,
                    text: 'Model',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `Price (${currency})`,
                },
            },
        },
    };

    const chartDataStructure = {
        labels: sortedData.map(item => item.Model),
        datasets: [
            {
                label: 'Price',
                data: sortedData.map(item => item.Price),
                backgroundColor: 'rgba(117, 114, 109, 0.62)',
                liters: sortedData.map(item => item.Liters),
                dimensions: sortedData.map(item => `${item.Height} x ${item.Width} x ${item.Depth} cm`),
                salesUnits: sortedData.map(item => item['Sales Units']),
            },
        ],
    };

    return (
        <div style={{ position: 'relative', width: '80vw', height: '60vh', margin: '0 auto' }}>
            <Bar data={chartDataStructure} options={chartOptions} plugins={[transparencyPlugin]} />
        </div>
    );
}

export default ChartDisplay;
