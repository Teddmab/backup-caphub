# Coding Structures Reference Guide

## Overview
This guide lists all the coding structures you must demonstrate across your three CSP assignments. Each structure should be properly commented and justified.

## 1. Variables and Data Types

### String Variables
```javascript
// Purpose: Store text-based information
// Justification: Need to handle user input and display text
var username = "student123";
var taskTitle = "Math Homework";
var statusMessage = "Task completed successfully";
```

### Number Variables
```javascript
// Purpose: Store numeric values for calculations
// Justification: Need to track quantities and perform math operations
var taskCount = 0;
var failedAttempts = 0;
var maxAttempts = 3;
var currentTime = Date.now();
```

### Boolean Variables
```javascript
// Purpose: Track true/false states
// Justification: Need to control program flow and track conditions
var isLoggedIn = false;
var taskCompleted = true;
var isPasswordValid = false;
```

### Array Variables
```javascript
// Purpose: Store collections of related data
// Justification: Need to manage multiple items efficiently
var taskList = [];
var subjects = ["Math", "Science", "English"];
var userPreferences = [];
```

## 2. Arrays and Lists

### Creating Arrays
```javascript
// Purpose: Initialize data collections
// Justification: Need structured data storage
var emptyArray = [];
var populatedArray = ["item1", "item2", "item3"];
var mixedArray = [1, "text", true, null];
```

### Accessing Array Elements
```javascript
// Purpose: Retrieve specific items from arrays
// Justification: Need to work with individual array elements
var firstItem = arrayName[0];
var lastItem = arrayName[arrayName.length - 1];
var specificItem = arrayName[index];
```

### Modifying Arrays
```javascript
// Purpose: Add, remove, or change array elements
// Justification: Need to update data dynamically
arrayName.push(newItem); // Add to end
arrayName.pop(); // Remove from end
arrayName.splice(index, 1); // Remove at specific index
arrayName[index] = newValue; // Replace element
```

### Array Traversal
```javascript
// Purpose: Process all elements in an array
// Justification: Need to perform operations on multiple items
for (var i = 0; i < arrayName.length; i++) {
    // Process each element
    console.log(arrayName[i]);
}

// Alternative: forEach method
arrayName.forEach(function(item, index) {
    // Process each element
    console.log(item);
});
```

## 3. Objects and Dictionaries

### Creating Objects
```javascript
// Purpose: Group related data together
// Justification: Need to organize complex data structures
var user = {
    username: "student123",
    email: "student@school.edu",
    grade: 10,
    isActive: true
};
```

### Accessing Object Properties
```javascript
// Purpose: Retrieve specific data from objects
// Justification: Need to work with object data
var username = user.username;
var email = user["email"];
var grade = user.grade;
```

### Modifying Objects
```javascript
// Purpose: Update object data
// Justification: Need to change object properties
user.grade = 11;
user["isActive"] = false;
user.newProperty = "new value";
```

### Nested Objects
```javascript
// Purpose: Create complex data structures
// Justification: Need to organize hierarchical data
var task = {
    id: 1,
    title: "Math Homework",
    details: {
        subject: "Mathematics",
        dueDate: "2024-01-15",
        priority: "high"
    },
    status: {
        completed: false,
        createdDate: "2024-01-10"
    }
};
```

## 4. Functions and Procedures

### Function Declaration
```javascript
// Purpose: Create reusable code blocks
// Justification: Need to avoid code duplication and organize logic
function functionName(parameter1, parameter2) {
    // Function body
    var result = parameter1 + parameter2;
    return result;
}
```

### Function with Parameters
```javascript
// Purpose: Pass data into functions
// Justification: Need flexible, reusable functions
function addTask(title, description, dueDate) {
    // Validate parameters
    if (!title || !dueDate) {
        return false;
    }
    
    // Create task object
    var newTask = {
        title: title,
        description: description,
        dueDate: dueDate,
        completed: false
    };
    
    // Add to task list
    taskList.push(newTask);
    return true;
}
```

### Function with Return Values
```javascript
// Purpose: Return data from functions
// Justification: Need to get results from function execution
function calculateAverage(numbers) {
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
}
```

### Anonymous Functions
```javascript
// Purpose: Create functions without names
// Justification: Need functions for event handlers and callbacks
var processData = function(data) {
    // Process the data
    return data.map(function(item) {
        return item * 2;
    });
};
```

## 5. Conditional Statements

### If Statements
```javascript
// Purpose: Make decisions based on conditions
// Justification: Need to control program flow
if (condition) {
    // Execute if condition is true
    console.log("Condition is true");
}
```

### If-Else Statements
```javascript
// Purpose: Handle two possible outcomes
// Justification: Need to respond to different conditions
if (isLoggedIn) {
    showDashboard();
} else {
    showLoginForm();
}
```

### If-Else If-Else Chains
```javascript
// Purpose: Handle multiple possible conditions
// Justification: Need to respond to various scenarios
if (taskPriority === "high") {
    setColor("red");
} else if (taskPriority === "medium") {
    setColor("yellow");
} else if (taskPriority === "low") {
    setColor("green");
} else {
    setColor("gray");
}
```

### Switch Statements
```javascript
// Purpose: Handle multiple specific values
// Justification: Cleaner than multiple if-else statements
switch (taskStatus) {
    case "pending":
        showPendingIcon();
        break;
    case "completed":
        showCompletedIcon();
        break;
    case "overdue":
        showOverdueIcon();
        break;
    default:
        showUnknownIcon();
}
```

## 6. Loops and Iteration

### For Loops
```javascript
// Purpose: Repeat code a specific number of times
// Justification: Need to process multiple items
for (var i = 0; i < array.length; i++) {
    console.log(array[i]);
}
```

### While Loops
```javascript
// Purpose: Repeat code while condition is true
// Justification: Need to repeat until condition changes
var attempts = 0;
while (attempts < maxAttempts) {
    if (validatePassword()) {
        break;
    }
    attempts++;
}
```

### Do-While Loops
```javascript
// Purpose: Execute code at least once, then check condition
// Justification: Need to ensure code runs at least once
do {
    var userInput = prompt("Enter password:");
} while (userInput.length < 4);
```

### For-In Loops (Object Properties)
```javascript
// Purpose: Iterate through object properties
// Justification: Need to process all object properties
for (var property in userObject) {
    console.log(property + ": " + userObject[property]);
}
```

## 7. Event Handling

### Click Events
```javascript
// Purpose: Respond to user clicks
// Justification: Need interactive user interface
onEvent("buttonId", "click", function() {
    // Handle button click
    console.log("Button clicked");
});
```

### Input Events
```javascript
// Purpose: Respond to user input
// Justification: Need to capture user data
onEvent("inputField", "input", function() {
    var value = getText("inputField");
    validateInput(value);
});
```

### Form Submission
```javascript
// Purpose: Handle form submissions
// Justification: Need to process user forms
onEvent("submitButton", "click", function() {
    var username = getText("usernameInput");
    var password = getText("passwordInput");
    processLogin(username, password);
});
```

## 8. Data Processing

### String Manipulation
```javascript
// Purpose: Process and modify text data
// Justification: Need to format and validate text
var fullName = firstName + " " + lastName;
var upperCase = text.toUpperCase();
var trimmed = text.trim();
var substring = text.substring(0, 10);
```

### Number Operations
```javascript
// Purpose: Perform mathematical calculations
// Justification: Need to process numeric data
var sum = a + b;
var average = sum / count;
var rounded = Math.round(number);
var random = Math.random() * 100;
```

### Array Processing
```javascript
// Purpose: Transform and filter array data
// Justification: Need to process collections of data
var filtered = array.filter(function(item) {
    return item > 0;
});

var mapped = array.map(function(item) {
    return item * 2;
});

var reduced = array.reduce(function(sum, item) {
    return sum + item;
}, 0);
```

## 9. Error Handling

### Try-Catch Blocks
```javascript
// Purpose: Handle errors gracefully
// Justification: Need to prevent app crashes
try {
    var data = JSON.parse(jsonString);
} catch (error) {
    console.error("Error parsing JSON:", error);
    showError("Invalid data format");
}
```

### Input Validation
```javascript
// Purpose: Ensure data is valid before processing
// Justification: Need to prevent invalid data errors
function validateInput(input) {
    if (!input || input.trim() === "") {
        showError("Input cannot be empty");
        return false;
    }
    if (input.length < 3) {
        showError("Input must be at least 3 characters");
        return false;
    }
    return true;
}
```

## 10. Data Persistence

### Local Storage
```javascript
// Purpose: Save data between sessions
// Justification: Need to persist user data
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
```

## Implementation Checklist

### Assignment 1 (Data Visualization):
- [ ] Variables (dataset arrays, filtered data)
- [ ] Arrays (data collections, results)
- [ ] Functions (data processing, visualization)
- [ ] Loops (data filtering, processing)
- [ ] Conditional statements (data validation, analysis)

### Assignment 2 (Lock Screen):
- [ ] Variables (password, attempts, time)
- [ ] Functions (validation, time display)
- [ ] Event handlers (button clicks)
- [ ] Conditional statements (password checking)
- [ ] Loops (time updates, password display)

### Assignment 3 (Final App):
- [ ] All structures from previous assignments
- [ ] Objects (user profiles, task data)
- [ ] Arrays (task lists, user data)
- [ ] Functions (CRUD operations, navigation)
- [ ] Event handlers (all user interactions)
- [ ] Data persistence (local storage)
- [ ] Error handling (validation, try-catch)

## Commenting Guidelines

### For Each Structure:
1. **Purpose**: What the code does
2. **Justification**: Why this approach was chosen
3. **Parameters**: What data is being processed
4. **Returns**: What the code produces
5. **Side Effects**: What else the code changes

### Example:
```javascript
// Purpose: Validate user login credentials
// Justification: Security requirement for app access
// Parameters: username (string), password (string)
// Returns: boolean indicating if login is valid
// Side Effects: Updates login attempt counter
function validateLogin(username, password) {
    // Implementation here
}
```

Remember: Every few lines should have comments explaining the purpose and justification for your coding decisions! 