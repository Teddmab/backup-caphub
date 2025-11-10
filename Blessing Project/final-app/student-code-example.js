/*
Author: BLESSING KAMALEBO MABULAY
Class: Computer Science Principles
Assignment: Unit 6 Lesson 13 - Final App (Student Task Manager)

This app helps students manage their homework and assignments.
It has multiple screens and saves data so you don't lose your tasks.
*/

// Variables to store data
var allTasks = []; // List of all tasks
var isUserLoggedIn = false; // Check if user is logged in
var currentUser = ""; // Current user's name
var registeredUsers = ["blessing", "student1", "student2"]; // List of users
var userPasswords = {"blessing": "password123", "student1": "student123", "student2": "student456"}; // Passwords

// When start button is clicked, show login screen
onEvent("startButton", "click", function() {
    // Show login elements
    setProperty("loginMessage", "hidden", false);
    setProperty("usernameInput", "hidden", false);
    setProperty("passwordInput", "hidden", false);
    setProperty("loginButton", "hidden", false);
    
    // Hide start button
    setProperty("startButton", "hidden", true);
    
    // Show login screen and update it
    setScreen("loginScreen");
    updateLoginScreen();
});

// When login button is clicked, check login
onEvent("loginButton", "click", function() {
    handleLogin();
});

// When logout button is clicked, go back to login
onEvent("logoutButton", "click", function() {
    handleLogout();
});

// When add task button is clicked, add new task
onEvent("addTaskButton", "click", function() {
    addNewTask();
});

// When delete task button is clicked, remove task
onEvent("deleteTaskButton", "click", function() {
    deleteTask();
});

// Individual checkbox event handlers for task completion
onEvent("taskCheckbox0", "change", function() {
    toggleSpecificTask(0);
});

onEvent("taskCheckbox1", "change", function() {
    toggleSpecificTask(1);
});

onEvent("taskCheckbox2", "change", function() {
    toggleSpecificTask(2);
});

onEvent("taskCheckbox3", "change", function() {
    toggleSpecificTask(3);
});

onEvent("taskCheckbox4", "change", function() {
    toggleSpecificTask(4);
});

onEvent("taskCheckbox5", "change", function() {
    toggleSpecificTask(5);
});

onEvent("taskCheckbox6", "change", function() {
    toggleSpecificTask(6);
});

onEvent("taskCheckbox7", "change", function() {
    toggleSpecificTask(7);
});

onEvent("taskCheckbox8", "change", function() {
    toggleSpecificTask(8);
});

onEvent("taskCheckbox9", "change", function() {
    toggleSpecificTask(9);
});

// Toggle specific task by index
function toggleSpecificTask(taskIndex) {
    if (taskIndex >= 0 && taskIndex < allTasks.length) {
        // Toggle the specific task
        allTasks[taskIndex].completed = !allTasks[taskIndex].completed;
        
        // Update the checkbox to reflect the new state
        var checkboxId = "taskCheckbox" + taskIndex;
        try {
            setProperty(checkboxId, "checked", allTasks[taskIndex].completed);
        } catch (error) {
            console.log("Checkbox " + checkboxId + " not found");
        }
        
        saveTasksToStorage();
        
        var status = allTasks[taskIndex].completed ? "completed" : "uncompleted";
        console.log("Task '" + allTasks[taskIndex].title + "' marked as " + status);
        
        // Update dashboard if we're on it
        try {
            updateDashboardStats();
            updateRecentTasks();
        } catch (error) {
            console.log("Dashboard update failed");
        }
    } else {
        console.log("Invalid task index: " + taskIndex);
    }
}

// Navigation buttons
onEvent("dashboardButton", "click", function() {
    setScreen("dashboardScreen");
    updateDashboardScreen();
});

onEvent("addTaskScreenButton", "click", function() {
    setScreen("addTaskScreen");
    updateAddTaskScreen();
});

onEvent("viewTasksButton", "click", function() {
    setScreen("viewTasksScreen");
    updateViewTasksScreen();
});

onEvent("settingsButton", "click", function() {
    setScreen("settingsScreen");
    updateSettingsScreen();
});

onEvent("dashboardButton2", "click", function() {
    setScreen("dashboardScreen");
    updateDashboardScreen();
});

onEvent("dashboardButton3", "click", function() {
    setScreen("dashboardScreen");
    updateDashboardScreen();
});

// Update login screen
function updateLoginScreen() {
    // Clear inputs
    setText("usernameInput", "");
    setText("passwordInput", "");
    
    // Show welcome message
    try {
        setText("loginMessage", "Welcome to Student Task Manager!");
        setProperty("loginMessage", "text-color", "black");
    } catch (error) {
        console.log("loginMessage element not found");
    }
}

// Update dashboard screen
function updateDashboardScreen() {
    // Update welcome message
    try {
        setText("welcomeMessage", "Welcome, " + currentUser + "!");
    } catch (error) {
        console.log("welcomeMessage element not found");
    }
    
    // Update statistics and chart
    updateDashboardStats();
    
    // Update recent tasks
    updateRecentTasks();
}

// Update add task screen
function updateAddTaskScreen() {
    // Clear input fields
    try {
        setText("taskTitleInput", "");
        setText("taskDescriptionInput", "");
        setText("taskSubjectInput", "");
        setText("taskDueDateInput", "");
        // Don't clear dropdown - it should keep its default value
    } catch (error) {
        console.log("Some add task elements not found");
    }
    
    // Clear any previous messages
    try {
        setText("messageDisplayTaskScreen", "");
        setProperty("messageDisplayTaskScreen", "text-color", "black");
        setProperty("messageDisplayTaskScreen", "background-color", "transparent");
    } catch (error) {
        console.log("messageDisplayTaskScreen element not found");
    }
}

// Update view tasks screen
function updateViewTasksScreen() {
    // Display tasks
    displayAllTasks();
}

// Update settings screen
function updateSettingsScreen() {
    // Display user info
    try {
        setText("currentUserDisplay", "Current User: " + currentUser);
        setText("totalTasksCount", "Total Tasks: " + allTasks.length);
    } catch (error) {
        console.log("Some settings elements not found");
    }
}

// Handle user login
function handleLogin() {
    // Get username and password
    var username = getText("usernameInput");
    var password = getText("passwordInput");
    
    // Check if fields are empty
    if (username === "" || password === "") {
        try {
            setText("loginMessage", "Error: Please enter both username and password");
            setProperty("loginMessage", "text-color", "red");
        } catch (error) {
            console.log("loginMessage element not found");
        }
        return;
    }
    
    // Check if username exists
    var userExists = false;
    for (var i = 0; i < registeredUsers.length; i++) {
        if (registeredUsers[i] === username) {
            userExists = true;
            break;
        }
    }
    
    if (!userExists) {
        try {
            setText("loginMessage", "Error: Username not found");
            setProperty("loginMessage", "text-color", "red");
        } catch (error) {
            console.log("loginMessage element not found");
        }
        return;
    }
    
    // Check password
    var correctPassword = userPasswords[username];
    if (password !== correctPassword) {
        try {
            setText("loginMessage", "Error: Wrong password");
            setProperty("loginMessage", "text-color", "red");
        } catch (error) {
            console.log("loginMessage element not found");
        }
        return;
    }
    
    // Login successful
    isUserLoggedIn = true;
    currentUser = username;
    
    try {
        setText("loginMessage", "Login successful! Welcome, " + username);
        setProperty("loginMessage", "text-color", "green");
    } catch (error) {
        console.log("loginMessage element not found");
    }
    
    // Load tasks
    loadTasksFromStorage();
    
    // Switch to dashboard screen
    setTimeout(function() {
        setScreen("dashboardScreen");
        updateDashboardScreen();
    }, 1500);
}

// Handle user logout
function handleLogout() {
    saveTasksToStorage();
    isUserLoggedIn = false;
    currentUser = "";
    allTasks = [];
    
    // Show login elements again
    setProperty("loginMessage", "hidden", false);
    setProperty("usernameInput", "hidden", false);
    setProperty("passwordInput", "hidden", false);
    setProperty("loginButton", "hidden", false);
    
    // Show start button again
    setProperty("startButton", "hidden", false);
    
    setScreen("loginScreen");
    updateLoginScreen();
}

// Show dashboard screen
function showDashboardScreen() {
    // Update welcome message
    try {
        setText("welcomeMessage", "Welcome, " + currentUser + "!");
    } catch (error) {
        console.log("welcomeMessage element not found");
    }
    
    // Update statistics
    updateDashboardStats();
}

// Update dashboard statistics
function updateDashboardStats() {
    var totalTasks = allTasks.length;
    var completedTasks = 0;
    var overdueTasks = 0;
    var highPriorityTasks = 0;
    
    // Count different types of tasks
    for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        
        if (task.completed) {
            completedTasks++;
        }
        
        // Check if task is overdue
        var today = new Date();
        var dueDate = new Date(task.dueDate);
        if (dueDate < today && !task.completed) {
            overdueTasks++;
        }
        
        if (task.priority === "high") {
            highPriorityTasks++;
        }
    }
    
    // Calculate completion percentage
    var completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Create combined statistics text
    var statsText = "Total Tasks: " + totalTasks + " Completed: " + completedTasks + " Overdue: " + overdueTasks + "\n";
    statsText += "High Priority: " + highPriorityTasks + " Completion Rate: " + completionPercentage + "%";
    
    // Update dashboard stats
    try {
        setText("dashboardStats", statsText);
    } catch (error) {
        console.log("dashboardStats element not found");
    }
}

// Update recent tasks display
function updateRecentTasks() {
    if (allTasks.length === 0) {
        try {
            setText("recentTasksDisplay", "No tasks yet. Add your first task to get started!");
        } catch (error) {
            console.log("recentTasksDisplay element not found");
        }
        return;
    }
    
    // Get the 5 most recent tasks
    var recentTasks = [];
    var startIndex = Math.max(0, allTasks.length - 5);
    
    for (var i = startIndex; i < allTasks.length; i++) {
        recentTasks.push(allTasks[i]);
    }
    
    var recentTasksText = "";
    
    for (var j = 0; j < recentTasks.length; j++) {
        var task = recentTasks[j];
        var statusIcon = task.completed ? "✓" : "○";
        var priorityIcon = task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢";
        
        recentTasksText += statusIcon + " " + task.title + "\n";
        recentTasksText += "   Subject: " + task.subject + "\n";
        recentTasksText += "   Due: " + task.dueDate + " " + priorityIcon + "\n";
        recentTasksText += "\n";
    }
    
    try {
        setText("recentTasksDisplay", recentTasksText);
    } catch (error) {
        console.log("recentTasksDisplay element not found");
    }
}

// Add new task
function addNewTask() {
    // Get task details
    var title = getText("taskTitleInput");
    var description = getText("taskDescriptionInput");
    var subject = getText("taskSubjectInput");
    var dueDate = getText("taskDueDateInput");
    var priority = getText("taskPriorityInput"); // This now gets the selected value from dropdown
    
    // Check if required fields are filled
    if (title === "" || dueDate === "") {
        try {
            setText("messageDisplayTaskScreen", "Error: Please fill in at least title and due date");
            setProperty("messageDisplayTaskScreen", "text-color", "red");
            setProperty("messageDisplayTaskScreen", "background-color", "#ffe6e6");
        } catch (error) {
            console.log("messageDisplayTaskScreen element not found");
        }
        return;
    }
    
    // Create new task
    var newTask = {
        id: Date.now() + Math.random(),
        title: title,
        description: description,
        subject: subject,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdDate: new Date().toLocaleDateString()
    };
    
    // Add to task list
    allTasks.push(newTask);
    
    // Save and show success message
    saveTasksToStorage();
    
    try {
        setText("messageDisplayTaskScreen", "Task added successfully!");
        setProperty("messageDisplayTaskScreen", "text-color", "green");
        setProperty("messageDisplayTaskScreen", "background-color", "#e6ffe6");
    } catch (error) {
        console.log("messageDisplayTaskScreen element not found");
    }
    
    // Clear inputs
    setText("taskTitleInput", "");
    setText("taskDescriptionInput", "");
    setText("taskSubjectInput", "");
    setText("taskDueDateInput", "");
    // Don't clear dropdown - it should keep its default value
}

// Display all tasks
function displayAllTasks() {
    if (allTasks.length === 0) {
        // Clear all task checkboxes
        clearTaskCheckboxes();
        try {
            setText("taskListDisplay", "No tasks yet. Add your first task to get started!");
        } catch (error) {
            console.log("taskListDisplay element not found");
        }
        return;
    }
    
    // Clear any previous task list text
    try {
        setText("taskListDisplay", "");
    } catch (error) {
        console.log("taskListDisplay element not found");
    }
    
    // Create checkboxes for each task
    for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        var checkboxId = "taskCheckbox" + i;
        var taskLabelId = "taskLabel" + i;
        
        // Set checkbox state based on task completion
        try {
            setProperty(checkboxId, "checked", task.completed);
        } catch (error) {
            console.log("Checkbox " + checkboxId + " not found");
        }
        
        // Update task label with task information
        var taskText = task.title + " - " + task.subject + " (Due: " + task.dueDate + ")";
        var priorityIcon = task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢";
        taskText += " " + priorityIcon;
        
        try {
            setText(taskLabelId, taskText);
        } catch (error) {
            console.log("Task label " + taskLabelId + " not found");
        }
    }
    
    // Clear any remaining checkboxes if we have fewer tasks than before
    clearTaskCheckboxes();
}

// Clear all task checkboxes beyond the current task count
function clearTaskCheckboxes() {
    var maxCheckboxes = 20; // Maximum number of checkboxes to check
    
    for (var i = allTasks.length; i < maxCheckboxes; i++) {
        var checkboxId = "taskCheckbox" + i;
        var taskLabelId = "taskLabel" + i;
        
        try {
            setProperty(checkboxId, "checked", false);
            setText(taskLabelId, "");
        } catch (error) {
            // Stop when we can't find more checkboxes
            break;
        }
    }
}

// Delete selected task
function deleteTask() {
    // Find which checkbox was clicked
    var selectedTaskIndex = -1;
    
    for (var i = 0; i < allTasks.length; i++) {
        var checkboxId = "taskCheckbox" + i;
        try {
            var isChecked = getProperty(checkboxId, "checked");
            if (isChecked) {
                selectedTaskIndex = i;
                break;
            }
        } catch (error) {
            console.log("Checkbox " + checkboxId + " not found");
        }
    }
    
    if (selectedTaskIndex >= 0 && selectedTaskIndex < allTasks.length) {
        var deletedTask = allTasks.splice(selectedTaskIndex, 1)[0];
        
        saveTasksToStorage();
        console.log("Task '" + deletedTask.title + "' deleted successfully");
        
        // Refresh the task display
        displayAllTasks();
        
        // Update dashboard if we're on it
        try {
            updateDashboardStats();
            updateRecentTasks();
        } catch (error) {
            console.log("Dashboard update failed");
        }
    } else {
        console.log("No task selected for deletion");
    }
}

// Show settings screen
function showSettingsScreen() {
    // Display user info
    try {
        setText("currentUserDisplay", "Current User: " + currentUser);
        setText("totalTasksCount", "Total Tasks: " + allTasks.length);
    } catch (error) {
        console.log("Some settings elements not found");
    }
}

// Save tasks to storage
function saveTasksToStorage() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("userTasks_" + currentUser, JSON.stringify(allTasks));
    }
}

// Load tasks from storage
function loadTasksFromStorage() {
    if (typeof localStorage !== 'undefined') {
        var savedTasks = localStorage.getItem("userTasks_" + currentUser);
        if (savedTasks) {
            allTasks = JSON.parse(savedTasks);
        } else {
            allTasks = [];
        }
    } else {
        allTasks = [];
    }
}

// Initialize app
onEvent("startButton", "click", function() {
    setScreen("loginScreen");
    updateLoginScreen();
});

/*
This app shows:
- How to make multiple screens
- How to save data so it doesn't get lost
- How to add, view, and delete tasks
- How to check if users are logged in
- How to count and display statistics
- How to handle different types of data

I learned how to use:
- Arrays and objects
- Loops and functions
- Event handlers
- Screen navigation
- Data storage
- Input validation
*/ 