# CSP Assignments Implementation Guide

## Overview
This guide provides step-by-step instructions for completing all three CSP assignments. Each assignment builds upon the previous one, demonstrating increasing complexity and mastery of programming concepts.

## Assignment 1: Data Visualisation Activity

### Step 1: Choose Your Dataset
**Recommended**: Ramen dataset (most comprehensive)
**Alternative**: Weather or Movie dataset

### Step 2: Select Meaningful Analysis
**Example**: "Do more expensive ramen brands receive higher ratings?"

**Justification**: This analysis reveals whether price correlates with quality, which is valuable for consumer decision-making.

### Step 3: Implementation in code.org
```javascript
// Data Visualization Analysis - Ramen Price vs Rating
// Purpose: Analyze correlation between ramen price and rating
// Author: [Your Name]
// Date: [Current Date]

// Step 1: Load and explore data
// Purpose: Understand the dataset structure
var brands = getColumn("ramen", "Brand");
var prices = getColumn("ramen", "Price");
var ratings = getColumn("ramen", "Stars");

console.log("Dataset loaded with " + brands.length + " entries");

// Step 2: Data filtering
// Purpose: Remove missing or invalid data points
// Justification: Missing data would skew the analysis
var validData = [];
for (var i = 0; i < brands.length; i++) {
    if (prices[i] !== null && ratings[i] !== null && 
        prices[i] > 0 && ratings[i] > 0) {
        validData.push({
            brand: brands[i],
            price: prices[i],
            rating: ratings[i]
        });
    }
}

console.log("Valid data points: " + validData.length);

// Step 3: Create visualization
// Purpose: Show relationship between price and rating
// Justification: Scatter plot best shows correlation between two variables
var chart = new Chart("priceRatingChart", {
    type: "scatter",
    data: {
        datasets: [{
            label: "Price vs Rating",
            data: validData.map(function(item) {
                return {x: item.price, y: item.rating};
            })
        }]
    },
    options: {
        scales: {
            x: {title: {display: true, text: "Price ($)"}},
            y: {title: {display: true, text: "Rating (Stars)"}}
        }
    }
});

// Step 4: Calculate correlation
// Purpose: Quantify the relationship strength
// Justification: Numerical analysis supports visual interpretation
var correlation = calculateCorrelation(validData);
console.log("Correlation coefficient: " + correlation);

// Step 5: Analysis and conclusion
// Purpose: Interpret the results
// Justification: Provide meaningful insights from the data
if (correlation > 0.3) {
    console.log("There is a moderate positive correlation between price and rating");
} else if (correlation < -0.3) {
    console.log("There is a moderate negative correlation between price and rating");
} else {
    console.log("There is little correlation between price and rating");
}
```

### Step 4: Address Bias
**Potential Biases**:
- **Selection bias**: Dataset may not represent all ramen brands
- **Rating bias**: Ratings may be influenced by brand recognition
- **Price bias**: Price data may not reflect actual market prices

**Justification**: Acknowledge these limitations and their potential impact on results.

## Assignment 2: Lock Screen App

### Step 1: Plan Your UI Layout
Create a simple, intuitive interface with:
- Time/date display at top
- Lock icon in center
- Password entry area
- Number pad at bottom

### Step 2: Implement Core Functionality
```javascript
// Lock Screen App Implementation
// Purpose: Create a functional lock screen with password protection
// Author: [Your Name]
// Date: [Current Date]

// Global variables for app state
// Purpose: Track application state across functions
// Justification: Need to maintain state for security features
var enteredPassword = "";
var correctPassword = "1234";
var failedAttempts = 0;
var maxAttempts = 3;

// Time display function
// Purpose: Show current time and date
// Justification: Standard lock screen feature
function updateTimeDisplay() {
    var now = new Date();
    
    // Format time
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var timeString = hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    
    // Format date
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dateString = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate();
    
    // Update UI
    setText("timeLabel", timeString);
    setText("dateLabel", dateString);
}

// Number button event handler
// Purpose: Handle password input
// Justification: Core functionality for password entry
onEvent("numberButton", "click", function() {
    var number = getText(this.id);
    enteredPassword += number;
    
    // Update display with asterisks
    var displayText = "";
    for (var i = 0; i < enteredPassword.length; i++) {
        displayText += "*";
    }
    setText("passwordDisplay", displayText);
    
    // Check if password is complete
    if (enteredPassword.length >= 4) {
        validatePassword();
    }
});

// Password validation
// Purpose: Check password and handle unlock
// Justification: Security verification step
function validatePassword() {
    if (enteredPassword === correctPassword) {
        unlockScreen();
    } else {
        handleFailedAttempt();
    }
    
    // Reset for next attempt
    enteredPassword = "";
    setText("passwordDisplay", "");
}

// Unlock function
// Purpose: Handle successful unlock
// Justification: Provide user feedback and transition
function unlockScreen() {
    setText("statusMessage", "Unlocked!");
    setProperty("statusMessage", "text-color", "green");
    setProperty("lockScreen", "hidden", true);
    setProperty("mainScreen", "hidden", false);
    failedAttempts = 0;
}

// Failed attempt handler
// Purpose: Manage security after failed attempts
// Justification: Prevent brute force attacks
function handleFailedAttempt() {
    failedAttempts++;
    setText("statusMessage", "Incorrect password. Try again.");
    setProperty("statusMessage", "text-color", "red");
    
    if (failedAttempts >= maxAttempts) {
        lockoutUser();
    }
}

// Lockout function
// Purpose: Temporarily disable access
// Justification: Security measure
function lockoutUser() {
    setText("statusMessage", "Too many failed attempts. Try again later.");
    setProperty("numberButtons", "enabled", false);
    
    setTimeout(function() {
        setProperty("numberButtons", "enabled", true);
        setText("statusMessage", "Enter password:");
        setProperty("statusMessage", "text-color", "black");
        failedAttempts = 0;
    }, 30000);
}

// Initialize app
// Purpose: Set up app on startup
// Justification: Required initialization
updateTimeDisplay();
setInterval(updateTimeDisplay, 1000);
```

### Step 3: Test Thoroughly
- Test correct password entry
- Test incorrect password handling
- Test lockout functionality
- Test time display accuracy

## Assignment 3: Final App (Student Task Manager)

### Step 1: Set Up Project Structure
Create a comprehensive app with 5 screens:
1. Login/Registration
2. Dashboard
3. Task Management
4. Calendar
5. Settings

### Step 2: Implement Core Data Structures
```javascript
// Student Task Manager - Main Application
// Purpose: Comprehensive task management app for students
// Author: [Your Name]
// Date: [Current Date]

// Global application state
// Purpose: Maintain app state across all screens
// Justification: Need consistent data management
var currentUser = "";
var isLoggedIn = false;
var currentScreen = "login";
var taskList = [];
var userProfile = {};

// User authentication data
// Purpose: Store user credentials and preferences
// Justification: User management requirement
var users = [
    {
        username: "student1",
        password: "password123",
        email: "student1@school.edu",
        grade: 10
    }
];

// Task data structure
// Purpose: Define task properties and organization
// Justification: Need structured data for task management
function createTask(title, description, subject, dueDate, priority) {
    return {
        id: generateTaskId(),
        title: title,
        description: description || "",
        subject: subject,
        dueDate: dueDate,
        priority: priority || "medium",
        completed: false,
        createdDate: getCurrentDate()
    };
}

// Screen navigation system
// Purpose: Manage transitions between app screens
// Justification: Multi-screen app requirement
function switchToScreen(screenName) {
    // Hide all screens
    var screens = ["loginScreen", "dashboardScreen", "taskScreen", "calendarScreen", "settingsScreen"];
    for (var i = 0; i < screens.length; i++) {
        setProperty(screens[i], "hidden", true);
    }
    
    // Show target screen
    setProperty(screenName + "Screen", "hidden", false);
    currentScreen = screenName;
    
    // Load screen-specific data
    loadScreenData(screenName);
}

// Screen data loading
// Purpose: Load appropriate data for each screen
// Justification: Efficient data management
function loadScreenData(screenName) {
    if (screenName === "dashboard") {
        updateDashboard();
    } else if (screenName === "task") {
        displayTasks(taskList);
    } else if (screenName === "calendar") {
        updateCalendar();
    }
}

// Task management functions
// Purpose: Handle all task-related operations
// Justification: Core app functionality
function addTask(title, description, subject, dueDate, priority) {
    // Validate input
    if (!title || !subject || !dueDate) {
        showError("Please fill in all required fields");
        return false;
    }
    
    // Create and add task
    var newTask = createTask(title, description, subject, dueDate, priority);
    taskList.push(newTask);
    
    // Update UI and storage
    updateUserStatistics();
    saveTasksToStorage();
    showSuccess("Task added successfully!");
    
    return true;
}

function completeTask(taskId) {
    // Find and update task
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskId) {
            taskList[i].completed = true;
            taskList[i].completedDate = getCurrentDate();
            break;
        }
    }
    
    // Update app state
    updateUserStatistics();
    saveTasksToStorage();
    refreshTaskDisplay();
}

// Task filtering and sorting
// Purpose: Help users find specific tasks
// Justification: User experience requirement
function filterTasks(filterType, filterValue) {
    var filteredTasks = [];
    
    for (var i = 0; i < taskList.length; i++) {
        var task = taskList[i];
        var includeTask = false;
        
        // Apply filters
        if (filterType === "subject" && task.subject === filterValue) {
            includeTask = true;
        } else if (filterType === "priority" && task.priority === filterValue) {
            includeTask = true;
        } else if (filterType === "status") {
            if (filterValue === "completed" && task.completed) {
                includeTask = true;
            } else if (filterValue === "pending" && !task.completed) {
                includeTask = true;
            }
        }
        
        if (includeTask) {
            filteredTasks.push(task);
        }
    }
    
    return filteredTasks;
}

// Event handlers for user interaction
// Purpose: Respond to user actions
// Justification: Interactive app requirement

// Login button
onEvent("loginButton", "click", function() {
    var username = getText("usernameInput");
    var password = getText("passwordInput");
    
    if (validateLogin(username, password)) {
        currentUser = username;
        isLoggedIn = true;
        loadUserData();
        switchToScreen("dashboard");
    } else {
        showError("Invalid username or password");
    }
});

// Add task button
onEvent("addTaskButton", "click", function() {
    switchToScreen("task");
    showAddTaskForm();
});

// Task completion checkbox
onEvent("taskCheckbox", "change", function() {
    var taskId = parseInt(this.getAttribute("data-task-id"));
    var isChecked = this.checked;
    
    if (isChecked) {
        completeTask(taskId);
    } else {
        uncompleteTask(taskId);
    }
});

// Data persistence
// Purpose: Save and load user data
// Justification: Data persistence requirement
function saveTasksToStorage() {
    try {
        var taskData = JSON.stringify(taskList);
        localStorage.setItem("userTasks_" + currentUser, taskData);
    } catch (error) {
        console.error("Error saving tasks:", error);
        showError("Failed to save tasks");
    }
}

function loadTasksFromStorage() {
    try {
        var taskData = localStorage.getItem("userTasks_" + currentUser);
        if (taskData) {
            taskList = JSON.parse(taskData);
        } else {
            taskList = [];
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
        taskList = [];
    }
}

// Utility functions
// Purpose: Support core functionality
// Justification: Code reusability and organization
function generateTaskId() {
    return Date.now() + Math.random();
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function showError(message) {
    setText("errorMessage", message);
    setProperty("errorMessage", "text-color", "red");
}

function showSuccess(message) {
    setText("successMessage", message);
    setProperty("successMessage", "text-color", "green");
}

// Initialize app
// Purpose: Set up app on startup
// Justification: Required initialization
function initializeApp() {
    switchToScreen("login");
    loadTasksFromStorage();
}
```

### Step 3: Implement Each Screen
Follow the detailed design document in `final-app/design.md` for complete screen implementations.

### Step 4: Add Advanced Features
- Calendar integration
- Task statistics and charts
- User preferences
- Data export/import

## Submission Checklist

### For All Assignments:
- [ ] Code is extensively commented
- [ ] All decisions are justified
- [ ] Error handling is implemented
- [ ] Code follows best practices
- [ ] Ready for code.org submission

### Data Visualization:
- [ ] Meaningful pattern identified
- [ ] Justification for filtering decisions
- [ ] Bias analysis completed
- [ ] Visualization choice explained

### Lock Screen App:
- [ ] Password functionality works
- [ ] Time display updates correctly
- [ ] Security features implemented
- [ ] UI is intuitive

### Final App:
- [ ] All 5 screens implemented
- [ ] All coding structures demonstrated
- [ ] Data persistence working
- [ ] User experience is smooth

## Tips for Success

1. **Start Early**: These assignments require significant time and testing
2. **Test Thoroughly**: Test each feature as you implement it
3. **Document Everything**: Comments should explain the "why" not just the "what"
4. **Plan Before Coding**: Sketch out your approach before writing code
5. **Use External Resources Wisely**: Only for specific syntax, not complete solutions
6. **Submit Early**: Don't wait until the last minute

## Getting Help

If you encounter issues:
1. Check the code.org documentation
2. Review the error messages carefully
3. Test small pieces of code individually
4. Ask specific questions about the problem
5. Ensure you understand the requirements before implementing

Good luck with your assignments! 