# Final App Design Document

## Assignment Overview
**Unit 6 Lesson 13** - Open-ended project covering all coding structures studied

## Core Requirements
1. **At least 3 screens**
2. **Cover all studied coding structures**
3. **Submit code directly in code.org**
4. **Extensive commenting**

## App Concept: "Student Task Manager"

### App Description
A comprehensive task management app for students that helps them organize assignments, track progress, and manage their academic schedule.

### Why This App?
- **Practical**: Addresses real student needs
- **Complex**: Requires multiple screens and features
- **Educational**: Demonstrates all coding structures
- **Scalable**: Can be extended with additional features

## Screen Architecture

### Screen 1: Login/Registration Screen
**Purpose**: User authentication and account creation
**Features**:
- Login form with username/password
- Registration option for new users
- Password validation and security
- Remember me functionality

### Screen 2: Dashboard/Home Screen
**Purpose**: Main overview of user's tasks and schedule
**Features**:
- Task summary (pending, completed, overdue)
- Quick add task button
- Today's schedule overview
- Progress charts/graphs
- Navigation to other screens

### Screen 3: Task Management Screen
**Purpose**: Detailed task creation, editing, and organization
**Features**:
- Add new tasks with details
- Edit existing tasks
- Mark tasks as complete
- Delete tasks
- Filter and search tasks
- Sort by priority, due date, subject

### Screen 4: Calendar/Schedule Screen
**Purpose**: Visual calendar view of tasks and deadlines
**Features**:
- Monthly/weekly calendar view
- Task indicators on dates
- Add tasks directly from calendar
- View task details by tapping dates

### Screen 5: Settings/Profile Screen
**Purpose**: User preferences and account management
**Features**:
- User profile information
- App preferences (notifications, themes)
- Account settings
- Help and support
- Logout functionality

## Coding Structures to Demonstrate

### 1. Variables and Data Types
```javascript
// Global Variables for App State
// Purpose: Store application-wide data and user information
// Justification: Need to maintain state across multiple screens

var currentUser = ""; // Store logged-in username
var userTasks = []; // Array to store all user tasks
var userSettings = {}; // Object to store user preferences
var isLoggedIn = false; // Boolean to track login status
var currentScreen = "login"; // String to track current screen
```

### 2. Arrays and Lists
```javascript
// Task Data Structure
// Purpose: Store and organize task information
// Justification: Need to manage multiple tasks with various properties

var taskList = [
    {
        id: 1,
        title: "Math Homework",
        description: "Complete problems 1-20",
        subject: "Mathematics",
        dueDate: "2024-01-15",
        priority: "high",
        completed: false,
        createdDate: "2024-01-10"
    }
    // More tasks...
];

// Subject Categories Array
// Purpose: Organize tasks by academic subjects
// Justification: Help users categorize and filter tasks

var subjects = ["Mathematics", "Science", "English", "History", "Art", "Physical Education"];
```

### 3. Objects and Dictionaries
```javascript
// User Profile Object
// Purpose: Store comprehensive user information
// Justification: Need to manage multiple user properties efficiently

var userProfile = {
    username: "student123",
    email: "student@school.edu",
    grade: 10,
    subjects: ["Mathematics", "Science", "English"],
    preferences: {
        notifications: true,
        theme: "light",
        language: "English"
    },
    statistics: {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0
    }
};
```

### 4. Functions and Procedures
```javascript
// Task Management Functions
// Purpose: Handle all task-related operations
// Justification: Modular code organization and reusability

function addTask(title, description, subject, dueDate, priority) {
    // Purpose: Create and add a new task to the task list
    // Justification: Centralized task creation with validation
    
    // Validate input parameters
    if (!title || !subject || !dueDate) {
        showError("Please fill in all required fields");
        return false;
    }
    
    // Create new task object
    var newTask = {
        id: generateTaskId(),
        title: title,
        description: description || "",
        subject: subject,
        dueDate: dueDate,
        priority: priority || "medium",
        completed: false,
        createdDate: getCurrentDate()
    };
    
    // Add to task list
    taskList.push(newTask);
    
    // Update user statistics
    updateUserStatistics();
    
    // Save to storage
    saveTasksToStorage();
    
    // Show success message
    showSuccess("Task added successfully!");
    
    return true;
}

function completeTask(taskId) {
    // Purpose: Mark a task as completed
    // Justification: Core functionality for task management
    
    // Find task in list
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskId) {
            taskList[i].completed = true;
            taskList[i].completedDate = getCurrentDate();
            break;
        }
    }
    
    // Update statistics and storage
    updateUserStatistics();
    saveTasksToStorage();
    refreshTaskDisplay();
}
```

### 5. Conditional Statements
```javascript
// Task Filtering and Sorting
// Purpose: Filter tasks based on various criteria
// Justification: Help users find specific tasks efficiently

function filterTasks(filterType, filterValue) {
    // Purpose: Filter tasks based on specified criteria
    // Justification: User needs to view specific task subsets
    
    var filteredTasks = [];
    
    for (var i = 0; i < taskList.length; i++) {
        var task = taskList[i];
        var includeTask = false;
        
        // Apply different filters based on filter type
        if (filterType === "subject") {
            if (task.subject === filterValue) {
                includeTask = true;
            }
        } else if (filterType === "priority") {
            if (task.priority === filterValue) {
                includeTask = true;
            }
        } else if (filterType === "status") {
            if (filterValue === "completed" && task.completed) {
                includeTask = true;
            } else if (filterValue === "pending" && !task.completed) {
                includeTask = true;
            } else if (filterValue === "overdue" && isTaskOverdue(task)) {
                includeTask = true;
            }
        }
        
        // Add task to filtered list if it meets criteria
        if (includeTask) {
            filteredTasks.push(task);
        }
    }
    
    return filteredTasks;
}
```

### 6. Loops and Iteration
```javascript
// Data Processing and Display
// Purpose: Process and display task data efficiently
// Justification: Need to handle multiple tasks and update UI

function displayTasks(taskArray) {
    // Purpose: Display tasks in the UI
    // Justification: Convert data to visual representation
    
    // Clear existing task display
    clearTaskDisplay();
    
    // Loop through all tasks and create UI elements
    for (var i = 0; i < taskArray.length; i++) {
        var task = taskArray[i];
        
        // Create task card element
        var taskCard = createTaskCard(task);
        
        // Add to display container
        addToTaskContainer(taskCard);
        
        // Add event listeners for task interactions
        addTaskEventListeners(taskCard, task.id);
    }
    
    // Update task count display
    updateTaskCount(taskArray.length);
}

function updateUserStatistics() {
    // Purpose: Calculate and update user task statistics
    // Justification: Provide user with progress overview
    
    var totalTasks = taskList.length;
    var completedTasks = 0;
    var overdueTasks = 0;
    
    // Loop through all tasks to calculate statistics
    for (var i = 0; i < taskList.length; i++) {
        var task = taskList[i];
        
        // Count completed tasks
        if (task.completed) {
            completedTasks++;
        }
        
        // Count overdue tasks
        if (!task.completed && isTaskOverdue(task)) {
            overdueTasks++;
        }
    }
    
    // Update user profile statistics
    userProfile.statistics.totalTasks = totalTasks;
    userProfile.statistics.completedTasks = completedTasks;
    userProfile.statistics.overdueTasks = overdueTasks;
    
    // Update UI with new statistics
    updateStatisticsDisplay();
}
```

### 7. Event Handling
```javascript
// User Interaction Event Handlers
// Purpose: Respond to user actions and input
// Justification: Core requirement for interactive app

// Login form submission
onEvent("loginButton", "click", function() {
    // Purpose: Handle user login attempt
    // Justification: Authentication is required for app access
    
    var username = getText("usernameInput");
    var password = getText("passwordInput");
    
    // Validate input
    if (!username || !password) {
        showError("Please enter both username and password");
        return;
    }
    
    // Attempt login
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
    // Purpose: Open task creation form
    // Justification: User needs to add new tasks
    
    switchToScreen("taskManagement");
    showAddTaskForm();
});

// Task completion checkbox
onEvent("taskCheckbox", "change", function() {
    // Purpose: Handle task completion status change
    // Justification: Core task management functionality
    
    var taskId = parseInt(this.getAttribute("data-task-id"));
    var isChecked = this.checked;
    
    if (isChecked) {
        completeTask(taskId);
    } else {
        uncompleteTask(taskId);
    }
});
```

### 8. Data Persistence
```javascript
// Local Storage Management
// Purpose: Save and load user data between sessions
// Justification: User data must persist across app sessions

function saveTasksToStorage() {
    // Purpose: Save task data to local storage
    // Justification: Data persistence requirement
    
    try {
        var taskData = JSON.stringify(taskList);
        localStorage.setItem("userTasks_" + currentUser, taskData);
        console.log("Tasks saved successfully");
    } catch (error) {
        console.error("Error saving tasks:", error);
        showError("Failed to save tasks");
    }
}

function loadTasksFromStorage() {
    // Purpose: Load task data from local storage
    // Justification: Restore user data on app startup
    
    try {
        var taskData = localStorage.getItem("userTasks_" + currentUser);
        if (taskData) {
            taskList = JSON.parse(taskData);
            console.log("Tasks loaded successfully");
        } else {
            taskList = []; // Initialize empty array if no data
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
        taskList = []; // Fallback to empty array
    }
}
```

## Implementation Plan

### Phase 1: Core Structure
1. Set up screen navigation system
2. Implement basic UI layouts
3. Create data structures and variables
4. Set up event handlers

### Phase 2: Authentication
1. Create login/registration screens
2. Implement user validation
3. Add session management
4. Test user flow

### Phase 3: Task Management
1. Implement task CRUD operations
2. Add filtering and sorting
3. Create task display components
4. Add task statistics

### Phase 4: Advanced Features
1. Calendar integration
2. Settings and preferences
3. Data persistence
4. Error handling

### Phase 5: Polish and Testing
1. UI/UX improvements
2. Comprehensive testing
3. Code documentation
4. Final submission preparation

## Success Criteria
- [ ] All 5 screens implemented and functional
- [ ] All coding structures demonstrated
- [ ] Comprehensive commenting throughout
- [ ] Error handling and validation
- [ ] Data persistence working
- [ ] Intuitive user interface
- [ ] Responsive design
- [ ] Ready for code.org submission 