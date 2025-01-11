// Function to get the current date in DD/MM/YYYY format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

// Function to get the current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to copy the current time to the clipboard
function copyCurrentTime() {
    const currentTime = getCurrentTime();
    navigator.clipboard.writeText(currentTime).then(() => {
        showConfirmation(`Current time (${currentTime}) copied!`);
    }).catch(() => {
        showConfirmation("Failed to copy time.", true);
    });
}

// Function to show confirmation text temporarily
function showConfirmation(message, isError = false) {
    const confirmation = document.createElement("div");
    confirmation.textContent = message;
    confirmation.style.position = "fixed";
    confirmation.style.bottom = "20px";
    confirmation.style.right = "20px";
    confirmation.style.padding = "10px 15px";
    confirmation.style.backgroundColor = isError ? "red" : "green";
    confirmation.style.color = "white";
    confirmation.style.borderRadius = "5px";
    confirmation.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    confirmation.style.zIndex = "1000";

    document.body.appendChild(confirmation);

    setTimeout(() => {
        confirmation.remove();
    }, 2000); // Message disappears after 2 seconds
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

// Function to handle input blur: convert input to plain text
function handleInputBlur(event) {
    const input = event.target;
    const value = input.value.trim();

    if (value) {
        const cell = input.parentElement;
        cell.textContent = value;
        cell.style.textAlign = "center";

        // Add click listener to make it editable again
        cell.onclick = () => makeCellEditable(cell, value);

        // Recalculate duration if applicable
        const row = cell.parentElement;
        if (cell.cellIndex === 1 || cell.cellIndex === 2) { // Start Time or End Time column
            updateDuration(row);
        }
    }
}

// Function to make a cell editable again
function makeCellEditable(cell, currentValue) {
    cell.innerHTML = `<input type="text" value="${currentValue}" onblur="handleInputBlur(event)" style="text-align: center;">`;
    const input = cell.querySelector("input");
    input.focus();
}

// Function to handle Task input blur
function handleTaskBlur(event) {
    const input = event.target;
    const value = input.value.trim();

    const cell = input.parentElement;
    if (value) {
        const taskText = document.createElement("span");
        taskText.textContent = `${cell.querySelectorAll("span").length + 1}. ${value}`;
        taskText.style.cursor = "pointer";
        taskText.onclick = () => makeTaskEditable(taskText);

        // Replace input with text
        cell.replaceChild(taskText, input);

        // Update numbering for all tasks
        updateTaskNumbers(cell);
    }
}

// Function to update task numbering within a cell
function updateTaskNumbers(cell) {
    const taskSpans = cell.querySelectorAll("span");
    taskSpans.forEach((span, index) => {
        const taskContent = span.textContent.split('. ').slice(1).join('. '); // Remove previous numbering
        span.textContent = `${index + 1}. ${taskContent}`;
    });
}

// Function to make a Task field editable
function makeTaskEditable(taskText) {
    const input = document.createElement("input");
    input.type = "text";

    // Remove numbering for editing
    const textWithoutNumber = taskText.textContent.split('. ').slice(1).join('. ');
    input.value = textWithoutNumber;
    input.onblur = handleTaskBlur;

    // Replace text with input
    const cell = taskText.parentElement;
    cell.replaceChild(input, taskText);
    input.focus();
}

// Function to add a new row to the table
function addRow() {
    const tableBody = document.getElementById("eodTableBody");
    const newRow = document.createElement("tr");

    // Get the last row's End Time
    const lastRow = tableBody.lastElementChild;
    const lastEndTime = lastRow ? lastRow.querySelector("td:nth-child(3)").textContent.trim() : "";

    newRow.innerHTML = `
        <td>${getCurrentDate()}</td>
        <td><input type="text" placeholder="Start Time (HH:MM)" onblur="handleInputBlur(event)" style="text-align: center;" value="${lastEndTime}"></td>
        <td><input type="text" placeholder="End Time (HH:MM)" onblur="handleInputBlur(event)" style="text-align: center;"></td>
        <td class="duration"></td>
        <td><input type="text" placeholder="Project" onblur="handleInputBlur(event)" style="text-align: center;"></td>
        <td>
            <input type="text" placeholder="Task 1" onblur="handleTaskBlur(event)">
        </td>
    `;

    tableBody.appendChild(newRow);
}

// Updated addTask function
function addTask() {
    const tableBody = document.getElementById("eodTableBody");
    const lastRow = tableBody.lastElementChild;

    if (!lastRow) {
        showConfirmation("Add a row first!", true);
        return;
    }

    const tasksCell = lastRow.querySelector("td:last-child");
    const taskCount = tasksCell.querySelectorAll("span, input").length + 1;

    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.placeholder = `Task ${taskCount}`;
    taskInput.onblur = handleTaskBlur;

    tasksCell.appendChild(document.createElement("br")); // Add a line break for the new task
    tasksCell.appendChild(taskInput);

    taskInput.focus(); // Immediately focus the new input
}

// Function to update duration based on start and end times
function updateDuration(row) {
    const startTime = row.querySelector("td:nth-child(2)").textContent.trim();
    const endTime = row.querySelector("td:nth-child(3)").textContent.trim();
    const durationCell = row.querySelector(".duration");

    durationCell.textContent = calculateDuration(startTime, endTime);
}

// Function to toggle Dark Mode
function toggleDarkMode() {
    const body = document.body;
    const darkModeEnabled = body.classList.toggle("dark-mode");

    // Save user preference in localStorage
    localStorage.setItem("darkMode", darkModeEnabled ? "enabled" : "disabled");

    // Update button text based on the mode
    const darkModeButton = document.getElementById("darkModeButton");
    darkModeButton.textContent = darkModeEnabled ? "Light Mode" : "Dark Mode";
}

// Apply saved theme preference on page load
window.onload = () => {
    addRow(); // Add initial row

    // Check saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "enabled") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeButton").textContent = "Light Mode";
    }
};
