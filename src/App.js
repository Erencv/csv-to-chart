import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChartDisplay from './components/ChartDisplay';

function App() {
    const [chartData, setChartData] = useState(null);

    const handleFileUpload = (data) => {
        setChartData(data);
    };

    return (
        <div>
            <h1>CSV to Chart</h1>
            <p>Your csv format should exactly be like the following: Brand,Model,Liters,Price,Sales Units,Height,Width,Depth
            </p>
            <FileUpload onFileUpload={handleFileUpload} />
            {chartData && <ChartDisplay chartData={chartData} />}
        </div>
    );
}

export default App;
