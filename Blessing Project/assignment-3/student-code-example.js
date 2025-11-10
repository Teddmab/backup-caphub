/*
Author: BLESSING KAMALEBO MABULAY
Class: Computer Science Principles
Assignment: Unit 6 Lesson 13 - Final App (Student Task Manager)

This assignment demonstrates:
- Multi-screen application architecture
- User authentication and data persistence
- CRUD operations (Create, Read, Update, Delete)
- Arrays and objects manipulation
- Event handling and user interface
- Data validation and error handling
- Local storage for data persistence
- Complex data structures and algorithms
*/

// Global variables to manage app state
// I chose to use global variables so they can be accessed across all screens
var allTasks = []; // Array to store all user tasks
var isUserLoggedIn = false; // Boolean to track login status
var currentUser = ""; // String to store current username
var registeredUsers = ["blessing", "student1", "student2"]; // Array of valid usernames

// Initialize the app when it loads
// This sets up the initial screen and loads any saved data
onEvent("startButton", "click", function() {
    showLoginScreen();
});

// Event handler for login button
// This validates user credentials and logs them in
onEvent("loginButton", "click", function() {
    handleLogin();
});

// Event handler for logout button
// This logs out the user and returns to login screen
onEvent("logoutButton", "click", function() {
    handleLogout();
});

// Event handler for adding new tasks
// This creates a new task and adds it to the user's task list
onEvent("addTaskButton", "click", function() {
    addNewTask();
});

// Event handler for completing tasks
// This marks a task as completed or uncompleted
onEvent("completeTaskButton", "click", function() {
    toggleTaskCompletion();
});

// Event handler for deleting tasks
// This removes a task from the user's task list
onEvent("deleteTaskButton", "click", function() {
    deleteTask();
});

// Event handler for navigation between screens
// This handles moving between different app screens
onEvent("dashboardButton", "click", function() {
    showDashboardScreen();
});

onEvent("addTaskScreenButton", "click", function() {
    showAddTaskScreen();
});

onEvent("viewTasksButton", "click", function() {
    showViewTasksScreen();
});

onEvent("settingsButton", "click", function() {
    showSettingsScreen();
});

// Function to show the login screen
// This is the first screen users see when opening the app
function showLoginScreen() {
    // Hide all other screens
    setProperty("dashboardScreen", "hidden", true);
    setProperty("addTaskScreen", "hidden", true);
    setProperty("viewTasksScreen", "hidden", true);
    setProperty("settingsScreen", "hidden", true);
    
    // Show login screen
    setProperty("loginScreen", "hidden", false);
    
    // Clear any previous login attempts
    setText("usernameInput", "");
    setText("passwordInput", "");
    setText("loginMessage", "Welcome to Student Task Manager!");
    
    console.log("Login screen displayed");
}

// Function to handle user login
// This validates credentials and sets up the user session
function handleLogin() {
    var username = getText("usernameInput");
    var password = getText("passwordInput");
    
    // Check if username and password are provided
    if (username === "" || password === "") {
        setText("loginMessage", "Error: Please enter both username and password");
        setProperty("loginMessage", "text-color", "red");
        return false;
    }
    
    // Check if username exists in our registered users
    // In a real app, this would check against a database
    var userExists = false;
    for (var i = 0; i < registeredUsers.length; i++) {
        if (registeredUsers[i] === username) {
            userExists = true;
            break;
        }
    }
    
    if (!userExists) {
        setText("loginMessage", "Error: Username not found");
        setProperty("loginMessage", "text-color", "red");
        return false;
    }
    
    // Simple password validation (in real app, this would be more secure)
    if (password.length < 6) {
        setText("loginMessage", "Error: Password must be at least 6 characters");
        setProperty("loginMessage", "text-color", "red");
        return false;
    }
    
    // Login successful
    currentUser = username;
    isUserLoggedIn = true;
    
    // Load user's saved tasks
    loadTasksFromStorage();
    
    // Show success message and go to dashboard
    setText("loginMessage", "Login successful! Welcome, " + username);
    setProperty("loginMessage", "text-color", "green");
    
    // Wait a moment then show dashboard
    setTimeout(function() {
        showDashboardScreen();
    }, 1000);
    
    console.log("User logged in: " + username);
    return true;
}

// Function to handle user logout
// This clears the session and returns to login
function handleLogout() {
    // Save current tasks before logging out
    saveTasksToStorage();
    
    // Clear session data
    currentUser = "";
    isUserLoggedIn = false;
    allTasks = [];
    
    // Return to login screen
    showLoginScreen();
    
    console.log("User logged out");
}

// Function to show the main dashboard screen
// This is the central hub where users can navigate to different features
function showDashboardScreen() {
    // Hide all other screens
    setProperty("loginScreen", "hidden", true);
    setProperty("addTaskScreen", "hidden", true);
    setProperty("viewTasksScreen", "hidden", true);
    setProperty("settingsScreen", "hidden", true);
    
    // Show dashboard screen
    setProperty("dashboardScreen", "hidden", false);
    
    // Update dashboard with current user info and task statistics
    updateDashboardDisplay();
    
    console.log("Dashboard screen displayed");
}

// Function to update the dashboard display
// This shows user information and task statistics
function updateDashboardDisplay() {
    // Display welcome message
    setText("welcomeMessage", "Welcome, " + currentUser + "!");
    
    // Calculate task statistics
    var totalTasks = allTasks.length;
    var completedTasks = 0;
    var overdueTasks = 0;
    var highPriorityTasks = 0;
    
    // Loop through all tasks to calculate statistics
    for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        
        if (task.completed) {
            completedTasks++;
        }
        
        if (isTaskOverdue(task)) {
            overdueTasks++;
        }
        
        if (task.priority === "high") {
            highPriorityTasks++;
        }
    }
    
    // Display statistics
    setText("totalTasksDisplay", "Total Tasks: " + totalTasks);
    setText("completedTasksDisplay", "Completed: " + completedTasks);
    setText("overdueTasksDisplay", "Overdue: " + overdueTasks);
    setText("highPriorityDisplay", "High Priority: " + highPriorityTasks);
    
    // Calculate completion percentage
    var completionPercentage = (totalTasks > 0) ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setText("completionPercentage", "Completion Rate: " + completionPercentage + "%");
    
    console.log("Dashboard updated - Tasks: " + totalTasks + ", Completed: " + completedTasks);
}

// Function to show the add task screen
// This allows users to create new tasks
function showAddTaskScreen() {
    // Hide all other screens
    setProperty("loginScreen", "hidden", true);
    setProperty("dashboardScreen", "hidden", true);
    setProperty("viewTasksScreen", "hidden", true);
    setProperty("settingsScreen", "hidden", true);
    
    // Show add task screen
    setProperty("addTaskScreen", "hidden", false);
    
    // Clear form fields
    setText("taskTitleInput", "");
    setText("taskDescriptionInput", "");
    setText("taskSubjectInput", "");
    setText("taskDueDateInput", "");
    setText("taskPriorityInput", "medium");
    
    console.log("Add task screen displayed");
}

// Function to add a new task
// This creates a task object and adds it to the user's task list
function addNewTask() {
    // Get input values
    var title = getText("taskTitleInput");
    var description = getText("taskDescriptionInput");
    var subject = getText("taskSubjectInput");
    var dueDate = getText("taskDueDateInput");
    var priority = getText("taskPriorityInput");
    
    // Validate required fields
    if (title === "" || subject === "" || dueDate === "") {
        showErrorMessage("Please fill in all required fields (Title, Subject, Due Date)");
        return false;
    }
    
    // Create new task object
    var newTask = {
        id: generateUniqueId(),
        title: title,
        description: description,
        subject: subject,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdDate: new Date().toISOString().split('T')[0],
        completedDate: null
    };
    
    // Add task to array
    allTasks.push(newTask);
    
    // Save to storage
    saveTasksToStorage();
    
    // Show success message
    showSuccessMessage("Task added successfully!");
    
    // Clear form
    setText("taskTitleInput", "");
    setText("taskDescriptionInput", "");
    setText("taskSubjectInput", "");
    setText("taskDueDateInput", "");
    
    console.log("New task added: " + title);
    return true;
}

// Function to show the view tasks screen
// This displays all user tasks with options to manage them
function showViewTasksScreen() {
    // Hide all other screens
    setProperty("loginScreen", "hidden", true);
    setProperty("dashboardScreen", "hidden", true);
    setProperty("addTaskScreen", "hidden", true);
    setProperty("settingsScreen", "hidden", true);
    
    // Show view tasks screen
    setProperty("viewTasksScreen", "hidden", false);
    
    // Load and display tasks
    loadDataForScreen();
    
    console.log("View tasks screen displayed");
}

// Function to load data for the current screen
// This updates the display with current task information
function loadDataForScreen() {
    // Load tasks from storage
    loadTasksFromStorage();
    
    // Display tasks
    displayAllTasks();
}

// Function to display all tasks in the task list
// This creates the HTML for each task with appropriate styling
function displayAllTasks() {
    var taskListHTML = "";
    
    if (allTasks.length === 0) {
        taskListHTML = "<p>No tasks yet. Add some tasks to get started!</p>";
    } else {
        // Loop through all tasks to create display HTML
        for (var i = 0; i < allTasks.length; i++) {
            var task = allTasks[i];
            var taskClass = task.completed ? "task-completed" : "task-pending";
            
            if (isTaskOverdue(task) && !task.completed) {
                taskClass = "task-overdue";
            }
            
            if (task.priority === "high") {
                taskClass += " high-priority";
            }
            
            taskListHTML += "<div class='" + taskClass + "'>";
            taskListHTML += "<h3>" + task.title + "</h3>";
            taskListHTML += "<p><strong>Subject:</strong> " + task.subject + "</p>";
            taskListHTML += "<p><strong>Due Date:</strong> " + task.dueDate + "</p>";
            taskListHTML += "<p><strong>Priority:</strong> " + task.priority + "</p>";
            taskListHTML += "<p><strong>Description:</strong> " + task.description + "</p>";
            taskListHTML += "<p><strong>Status:</strong> " + (task.completed ? "Completed" : "Pending") + "</p>";
            
            if (task.completed && task.completedDate) {
                taskListHTML += "<p><strong>Completed:</strong> " + task.completedDate + "</p>";
            }
            
            taskListHTML += "<button onclick='toggleTaskCompletion(" + task.id + ")'>";
            taskListHTML += (task.completed ? "Mark Incomplete" : "Mark Complete");
            taskListHTML += "</button>";
            
            taskListHTML += "<button onclick='deleteTask(" + task.id + ")'>Delete</button>";
            taskListHTML += "</div>";
        }
    }
    
    setText("taskListDisplay", taskListHTML);
    console.log("Tasks displayed: " + allTasks.length + " tasks");
}

// Function to toggle task completion status
// This marks a task as completed or uncompleted
function toggleTaskCompletion(taskId) {
    // Find the task in the array
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            // Toggle completion status
            allTasks[i].completed = !allTasks[i].completed;
            
            // Set completion date if completed
            if (allTasks[i].completed) {
                allTasks[i].completedDate = new Date().toISOString().split('T')[0];
            } else {
                allTasks[i].completedDate = null;
            }
            
            break;
        }
    }
    
    // Save changes and update display
    saveTasksToStorage();
    displayAllTasks();
    
    console.log("Task completion toggled for task ID: " + taskId);
}

// Function to delete a task
// This removes a task from the user's task list
function deleteTask(taskId) {
    // Filter out the task to delete
    allTasks = allTasks.filter(function(task) {
        return task.id !== taskId;
    });
    
    // Save changes and update display
    saveTasksToStorage();
    displayAllTasks();
    
    showSuccessMessage("Task deleted successfully!");
    console.log("Task deleted: " + taskId);
}

// Function to check if a task is overdue
// This compares the due date with today's date
function isTaskOverdue(task) {
    if (task.completed) {
        return false; // Completed tasks can't be overdue
    }
    
    var today = new Date();
    var dueDate = new Date(task.dueDate);
    
    return today > dueDate;
}

// Function to show the settings screen
// This allows users to manage their account and preferences
function showSettingsScreen() {
    // Hide all other screens
    setProperty("loginScreen", "hidden", true);
    setProperty("dashboardScreen", "hidden", true);
    setProperty("addTaskScreen", "hidden", true);
    setProperty("viewTasksScreen", "hidden", true);
    
    // Show settings screen
    setProperty("settingsScreen", "hidden", false);
    
    // Display current user information
    setText("currentUserDisplay", "Current User: " + currentUser);
    setText("totalTasksCount", "Total Tasks: " + allTasks.length);
    
    console.log("Settings screen displayed");
}

// Function to generate a unique ID for tasks
// This ensures each task has a unique identifier
function generateUniqueId() {
    return Date.now() + Math.random();
}

// Function to save tasks to local storage
// This persists user data between sessions
function saveTasksToStorage() {
    try {
        localStorage.setItem("userTasks_" + currentUser, JSON.stringify(allTasks));
        console.log("Tasks saved to storage for user: " + currentUser);
    } catch (error) {
        console.log("Error saving tasks: " + error.message);
        showErrorMessage("Error saving tasks. Please try again.");
    }
}

// Function to load tasks from local storage
// This retrieves user data when they log in
function loadTasksFromStorage() {
    try {
        var savedTasks = localStorage.getItem("userTasks_" + currentUser);
        if (savedTasks) {
            allTasks = JSON.parse(savedTasks);
            console.log("Tasks loaded from storage: " + allTasks.length + " tasks");
        } else {
            allTasks = [];
            console.log("No saved tasks found for user: " + currentUser);
        }
    } catch (error) {
        console.log("Error loading tasks: " + error.message);
        allTasks = [];
        showErrorMessage("Error loading tasks. Starting with empty task list.");
    }
}

// Function to show error messages
// This provides user feedback for errors
function showErrorMessage(message) {
    setText("messageDisplay", "Error: " + message);
    setProperty("messageDisplay", "text-color", "red");
    
    // Clear message after 3 seconds
    setTimeout(function() {
        setText("messageDisplay", "");
    }, 3000);
}

// Function to show success messages
// This provides user feedback for successful operations
function showSuccessMessage(message) {
    setText("messageDisplay", message);
    setProperty("messageDisplay", "text-color", "green");
    
    // Clear message after 3 seconds
    setTimeout(function() {
        setText("messageDisplay", "");
    }, 3000);
}

/*
Justification for Design Choices:

1. Multi-Screen Architecture: I created 5 screens (login, dashboard, add task, view tasks, settings)
   to demonstrate comprehensive app design and navigation.

2. User Authentication: I implemented a simple login system to show how user sessions work
   and to personalize the experience for each user.

3. Data Persistence: I used localStorage to save user tasks, demonstrating how apps can
   remember data between sessions.

4. CRUD Operations: The app includes Create (add tasks), Read (view tasks), Update (complete tasks),
   and Delete (remove tasks) operations to show full data management.

5. Data Validation: I included input validation to ensure data quality and prevent errors.

6. Error Handling: I implemented try-catch blocks and user feedback to handle errors gracefully.

7. Task Management Features: I included priority levels, due dates, completion tracking,
   and overdue detection to make the app practical and useful.

8. User Interface: I created an intuitive interface with clear navigation and visual feedback
   for user actions.

This implementation demonstrates mastery of:
- Multi-screen application design
- User authentication and session management
- Data persistence and storage
- CRUD operations and data management
- Input validation and error handling
- Event-driven programming
- Complex data structures (arrays of objects)
- User interface design and navigation
- Local storage and data serialization
- Algorithm implementation (task filtering, statistics)
*/ 