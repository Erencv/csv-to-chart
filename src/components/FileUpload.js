import React, { useState } from 'react';
import Papa from 'papaparse';

function FileUpload({ onFileUpload }) {
    const [currency, setCurrency] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(results.data);  // Log the parsed data to check for correctness
                    const data = results.data.map(item => ({
                        Brand: item.Brand,
                        Model: item.Model,
                        Liters: item.Liters,
                        Price: item.Price,
                        'Sales Units': item['Sales Units'],
                        Height: item.Height,
                        Width: item.Width,
                        Depth: item.Depth
                    }));

                    onFileUpload({ data, currency });
                },
                error: (error) => {
                    alert(`Error parsing CSV: ${error.message}`);
                }
            });
        }
    };

    return (
        <div>
            <label htmlFor="currency">Currency:</label>
            <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
            >
                <option value="">Select Currency</option>
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>
            <br /><br />
            <label htmlFor="file">Upload CSV:</label>
            <input
                type="file"
                id="file"
                accept=".csv"
                onChange={handleFileChange}
                required
            /><br /><br />
        </div>
    );
}

export default FileUpload;
