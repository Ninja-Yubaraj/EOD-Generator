// Function to get the current date in DD/MM/YYYY format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

// Function to add a new row to the table
function addRow() {
    const tableBody = document.getElementById("eodTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${getCurrentDate()}</td>
        <td><input type="text" placeholder="Start Time"></td>
        <td><input type="text" placeholder="End Time"></td>
        <td><input type="text" placeholder="Duration"></td>
        <td><input type="text" placeholder="Project"></td>
        <td>
            <input type="text" placeholder="Task 1"><br>
            <input type="text" placeholder="Task 2">
        </td>
    `;

    tableBody.appendChild(newRow);
}

// Add one row on page load
window.onload = () => {
    addRow();
};
