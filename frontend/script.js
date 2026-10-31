
const reportForm = document.getElementById("reportForm");
const checkStatusButton = document.getElementById("checkStatus");
const resultBox = document.getElementById("result");
const reportIdInput = document.getElementById("reportId");

const API_URL = "/api/reports";

// CREATE REPORT
reportForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = Number(document.getElementById("userId").value);
    const reportType = document.getElementById("reportType").value;
    const format = document.getElementById("format").value;

    try {
        resultBox.textContent = "Creating report...";

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                reportType,
                format
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        // Save report ID for checking status
        reportIdInput.value = data.data.id;

        resultBox.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error("Create report error:", error);
        resultBox.textContent = error.message;
    }
});

// GET REPORT BY ID
checkStatusButton.addEventListener("click", async () => {
    const reportId = reportIdInput.value.trim();
    const userId = document.getElementById("userId").value;

    if (!reportId) {
        resultBox.textContent = "Please enter a report ID.";
        return;
    }

    try {
        resultBox.textContent = "Fetching report status...";

        const response = await fetch(`${API_URL}/${encodeURIComponent(reportId)}`, {
            method: "GET",
            headers: {
                "X-User-Id": userId
            }
        });

        const data = await response.json();

        resultBox.textContent = JSON.stringify(data, null, 2);

        if (!response.ok) {
            console.error("API request failed:", data.message);
        }

    } catch (error) {
        console.error("Fetch report error:", error);
        resultBox.textContent = error.message;
    }
});
