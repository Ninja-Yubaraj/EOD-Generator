// Function to get the current date in DD/MM/YYYY format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

// Function to calculate duration in hours (24-hour format)
function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return "";
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    if (isNaN(startHours) || isNaN(endHours)) return "";

    let durationHours = endHours - startHours;
    let durationMinutes = endMinutes - startMinutes;

    if (durationMinutes < 0) {
        durationMinutes += 60;
        durationHours -= 1;
    }

    if (durationHours < 0) durationHours += 24;

    return `${String(durationHours).padStart(2, '0')}:${String(durationMinutes).padStart(2, '0')}`;
}

// Function to add a new row to the table
function addRow() {
    const tableBody = document.getElementById("eodTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${getCurrentDate()}</td>
        <td><input type="text" placeholder="Start Time (HH:MM)" oninput="updateDuration(this)"></td>
        <td><input type="text" placeholder="End Time (HH:MM)" oninput="updateDuration(this)"></td>
        <td class="duration"></td>
        <td><input type="text" placeholder="Project"></td>
        <td>
            <input type="text" placeholder="Task 1">
        </td>
    `;

    tableBody.appendChild(newRow);
}

// Function to add a new task to the current row
function addTask() {
    const tableBody = document.getElementById("eodTableBody");
    const lastRow = tableBody.lastElementChild;

    if (!lastRow) {
        alert("Add a row first!");
        return;
    }

    const tasksCell = lastRow.querySelector("td:last-child");
    const taskCount = tasksCell.querySelectorAll("input").length + 1;

    const newTask = document.createElement("input");
    newTask.type = "text";
    newTask.placeholder = `Task ${taskCount}`;

    tasksCell.appendChild(document.createElement("br"));
    tasksCell.appendChild(newTask);
}

// Function to update duration based on start and end times
function updateDuration(inputElement) {
    const row = inputElement.closest("tr");
    const startTime = row.querySelector("td:nth-child(2) input").value;
    const endTime = row.querySelector("td:nth-child(3) input").value;
    const durationCell = row.querySelector(".duration");

    durationCell.textContent = calculateDuration(startTime, endTime);
}

// Add one row on page load
window.onload = () => {
    addRow();
};
