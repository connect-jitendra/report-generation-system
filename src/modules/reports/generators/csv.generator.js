
 // Convert database records into CSV-formatted text.
const generateCSV = async (rows) => {
    // Prevent CSV generation when no records are available.
    if (rows.length === 0) {
        throw new Error("No data available to generate CSV");
    }

    // Extract column names from the first record to create the CSV header.
    const headers = Object.keys(rows[0]);
    const headerLine = headers.join(",");

    // Convert each database record into a comma-separated row.
    const dataLines = rows.map((row) => {
        const rowLine = Object.values(row).join(",");
        return rowLine;
    });

    // Combine the header and data rows into the final CSV content.
    const result = `${headerLine}\n${dataLines.join("\n")}`;
    return result;

};

export default generateCSV;
