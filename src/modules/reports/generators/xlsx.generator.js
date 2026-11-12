import ExcelJs from "exceljs";

const generateXLSX = async (rows) => {

    if (rows.length === 0) {
        throw new Error("No data available to generate XLSX");
    }

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    const headers = Object.keys(rows[0]);
    worksheet.addRow(headers);

    rows.forEach((row) => {
        const values = Object.values(row);
        worksheet.addRow(values);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export default generateXLSX;