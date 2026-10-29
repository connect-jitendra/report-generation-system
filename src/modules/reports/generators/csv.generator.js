const generateCSV = async (rows) => {
    if (rows.length === 0) {
        throw new Error("No data available to generate CSV");
    }

    const headers = Object.keys(rows[0]);
    const headerLine = headers.join(",");
    const dataLines = rows.map((row) => {
        const rowLine = Object.values(row).join(",");
        return rowLine;
    });

    const result = `${headerLine}\n${dataLines.join("\n")}`;
    return result;

};

export default generateCSV;
