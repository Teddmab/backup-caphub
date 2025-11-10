# CSP Assignments Testing Guide

## Overview
This guide will help you test your two CSP assignments using the provided test environment. The test environment simulates code.org's App Lab functionality so you can verify your code works before transferring it to the actual platform.

## How to Use the Test Environment

### Step 1: Open the Test Environment
1. Open the `test-environment.html` file in your web browser
2. You'll see two sections, one for each assignment
3. Each section has test buttons and output areas

### Step 2: Test Each Assignment
Follow the testing procedures below for each assignment.

## Assignment 1: Data Visualization Testing

### What to Test:
- Data loading and filtering
- Correlation analysis
- Bias identification
- Code commenting and justification

### Testing Steps:

#### 1. Load Sample Data
- Click "Load Sample Data"
- Verify output shows: "Loading sample ramen dataset..."
- Confirm dataset information is displayed

#### 2. Run Data Analysis
- Click "Run Data Analysis"
- Check that the following steps are executed:
  - Dataset loading with entry count
  - Data filtering (removing invalid entries)
  - Correlation calculation
  - Result interpretation

#### 3. Expected Output:
```
=== Data Visualization Test ===
Testing ramen price vs rating correlation analysis...
This demonstrates the analysis process you'll implement.
Dataset loaded with 5 entries
Valid data points: 5
Correlation coefficient: 0.75
There is a moderate positive correlation between price and rating
This suggests that more expensive ramen tends to have higher ratings.
=== Test Complete ===
Remember to address potential biases in your actual analysis!
```

### What This Tests:
- ✅ Variables and data types
- ✅ Arrays and list processing
- ✅ Loops for data filtering
- ✅ Conditional statements for analysis
- ✅ Functions for data processing
- ✅ Proper commenting and justification

### Code.org Transfer Notes:
- Replace mock functions with actual code.org data functions
- Use `getColumn()` for data access
- Implement actual chart creation with code.org's chart tools
- Add your bias analysis in the final section

## Assignment 2: Final App (Task Manager) Testing

### What to Test:
- User authentication
- Task creation and management
- Data persistence
- Multi-screen functionality
- All coding structures

### Testing Steps:

#### 1. Initialize Task Manager
- Click "Initialize Task Manager"
- Verify user is logged in
- Confirm task list is empty initially

#### 2. Test Login System
- Click "Test Login"
- Verify successful login message
- Confirm user data is loaded

#### 3. Add Sample Tasks
- Click "Add Sample Tasks"
- Verify 3 sample tasks are added
- Confirm tasks display with proper formatting
- Check priority colors (high priority = red border)

#### 4. Test Task Management
- Add a new task using the form
- Fill in: Title, Description, Subject, Due Date, Priority
- Click "Add Task"
- Verify task appears in the list
- Test completing a task (click "Complete")
- Test deleting a task (click "Delete")

#### 5. Test Data Persistence
- Add some tasks
- Refresh the browser page
- Click "Test Login" again
- Verify tasks are still there (stored in localStorage)

### Expected Behaviors:
- ✅ App initializes properly
- ✅ Login system works
- ✅ Tasks can be added, completed, and deleted
- ✅ Task priorities are visually indicated
- ✅ Data persists between sessions
- ✅ Form validation works
- ✅ Error messages display correctly

### What This Tests:
- ✅ All coding structures from previous assignments
- ✅ Objects (user profiles, task data)
- ✅ Arrays (task lists, user data)
- ✅ Functions (CRUD operations, navigation)
- ✅ Event handlers (all user interactions)
- ✅ Data persistence (local storage)
- ✅ Error handling (validation, try-catch)
- ✅ Multi-screen app architecture

### Code.org Transfer Notes:
- Create actual screens in code.org App Lab
- Use `setProperty()` for screen transitions
- Implement proper UI components
- Add your own styling and layout

## Testing Checklist

### Before Testing:
- [ ] All code is properly commented
- [ ] Justifications are provided for decisions
- [ ] Error handling is implemented
- [ ] Code follows best practices

### During Testing:
- [ ] All buttons and interactions work
- [ ] Data is processed correctly
- [ ] Error messages are helpful
- [ ] UI is responsive and intuitive
- [ ] Security features function properly

### After Testing:
- [ ] All functionality works as expected
- [ ] Code is ready for code.org transfer
- [ ] Comments explain the "why" not just "what"
- [ ] External sources are properly cited (if used)

## Common Issues and Solutions

### Issue: Functions not working
**Solution**: Check that all function names match exactly between your code and the test environment.

### Issue: Data not persisting
**Solution**: Verify localStorage functions are implemented correctly and error handling is in place.

### Issue: UI not updating
**Solution**: Ensure `setText()` and `setProperty()` functions are called with correct element IDs.

### Issue: Event handlers not responding
**Solution**: Check that `onEvent()` functions are properly set up with correct event types.

## Code.org Integration Tips

### 1. Component Mapping
- Test Environment Button → code.org Button
- Test Environment Input → code.org Text Input
- Test Environment Output → code.org Label
- Test Environment Screen → code.org Screen

### 2. Function Mapping
- `setText()` → code.org's `setText()`
- `setProperty()` → code.org's `setProperty()`
- `getText()` → code.org's `getText()`
- `onEvent()` → code.org's `onEvent()`

### 3. Data Storage
- `localStorage` → code.org's data storage or App Lab's built-in storage

## Final Testing Steps

### 1. Complete Functionality Test
- Test every feature of each assignment
- Verify all user interactions work
- Confirm data flows correctly

### 2. Code Review
- Check all comments are present and meaningful
- Verify justifications are provided
- Ensure code is well-organized

### 3. Error Handling Test
- Test edge cases (empty inputs, invalid data)
- Verify error messages are helpful
- Confirm app doesn't crash

### 4. Performance Test
- Test with larger datasets
- Verify app remains responsive
- Check memory usage is reasonable

## Ready for Submission

Once you've completed all testing:

1. **Transfer to code.org**: Copy your tested code to the code.org platform
2. **Final testing**: Test again in code.org environment
3. **Submit**: Follow your teacher's submission instructions
4. **Documentation**: Ensure all required documentation is complete

## Success Criteria

Your assignments are ready when:
- ✅ All functionality works correctly
- ✅ Code is extensively commented
- ✅ All decisions are justified
- ✅ Error handling is robust
- ✅ User experience is smooth
- ✅ All coding structures are demonstrated
- ✅ Code follows best practices

Good luck with your testing and submission! 