# Data Visualisation Activity Analysis Guide

## Assignment Overview
**Unit 5 Lesson 8** - Create meaningful data visualizations using code.org datasets

## Key Requirements
1. **Non-trivial patterns**: Avoid simple brand vs style relationships
2. **Meaningful insights**: Focus on trends that reveal something interesting
3. **Justification**: Explain every decision made
4. **Bias awareness**: Address potential data collection biases

## Recommended Datasets & Analysis Approaches

### 1. Ramen Dataset Analysis
**Meaningful Patterns to Explore:**
- **Country vs Average Rating**: Which countries produce the highest-rated ramen?
- **Price vs Rating**: Is there a correlation between price and quality?
- **Style vs Rating by Country**: Do certain styles perform better in specific countries?

**Justification**: These patterns reveal cultural preferences, economic factors, and quality indicators.

### 2. Weather Dataset Analysis
**Meaningful Patterns to Explore:**
- **Temperature vs Humidity**: Seasonal patterns and correlations
- **Weather Events vs Time**: Frequency patterns throughout the year
- **Location vs Weather Patterns**: Geographic climate differences

**Justification**: These reveal environmental patterns and seasonal trends.

### 3. Movie Dataset Analysis
**Meaningful Patterns to Explore:**
- **Genre vs Rating**: Which genres consistently receive higher ratings?
- **Year vs Rating**: Has movie quality changed over time?
- **Budget vs Revenue**: Return on investment analysis

**Justification**: These patterns reveal industry trends and audience preferences.

## Implementation Strategy

### Step 1: Data Selection
- Choose a dataset with sufficient data points
- Identify variables that could show meaningful relationships
- Consider what insights would be valuable

### Step 2: Data Filtering Decisions
**Document why you filter (or don't filter):**
- **If filtering**: "I removed outliers because they skewed the analysis"
- **If not filtering**: "I kept all data to show the complete picture"

### Step 3: Visualization Choice
**Justify your chart type:**
- **Scatter plot**: For correlation analysis
- **Bar chart**: For categorical comparisons
- **Line chart**: For time-based trends
- **Histogram**: For distribution analysis

### Step 4: Bias Analysis
**Common biases to address:**
- **Selection bias**: Data not representative of population
- **Measurement bias**: Inconsistent data collection methods
- **Reporting bias**: Self-reported data may be inaccurate
- **Temporal bias**: Data from specific time periods only

## Example Analysis Framework

### For Ramen Dataset:
1. **Question**: "Do more expensive ramen brands receive higher ratings?"
2. **Hypothesis**: There should be a positive correlation
3. **Data preparation**: Filter out missing values, group by price ranges
4. **Visualization**: Scatter plot of price vs average rating
5. **Analysis**: Calculate correlation coefficient
6. **Conclusion**: Support or reject hypothesis
7. **Bias discussion**: Consider cultural preferences, brand recognition

### For Weather Dataset:
1. **Question**: "How do temperature patterns vary by season?"
2. **Hypothesis**: Clear seasonal temperature cycles
3. **Data preparation**: Group by months/seasons
4. **Visualization**: Line chart showing temperature over time
5. **Analysis**: Identify peak and low temperature periods
6. **Conclusion**: Confirm seasonal patterns
7. **Bias discussion**: Consider location-specific climate factors

## Code Structure Template

```javascript
// Data Visualization Analysis
// Purpose: Analyze [dataset] to understand [specific relationship]
// Author: [Your Name]
// Date: [Current Date]

// Step 1: Data Loading and Initial Exploration
// Purpose: Load the dataset and understand its structure
var dataset = getColumn("dataset_name", "column_name");
console.log("Dataset loaded with " + dataset.length + " entries");

// Step 2: Data Filtering (if applicable)
// Purpose: Remove irrelevant or problematic data points
// Justification: [Explain why filtering is needed]
var filteredData = [];
for (var i = 0; i < dataset.length; i++) {
    // Filtering logic here
    if (/* condition */) {
        filteredData.push(dataset[i]);
    }
}

// Step 3: Data Processing
// Purpose: Transform data for analysis
// Justification: [Explain the transformation]
var processedData = [];
// Processing logic here

// Step 4: Visualization Creation
// Purpose: Create chart to show the relationship
// Justification: [Explain why this chart type is appropriate]
// Chart creation code here

// Step 5: Analysis
// Purpose: Interpret the visualization results
// Justification: [Explain what the results mean]
// Analysis code here
```

## Submission Checklist
- [ ] Chose meaningful data relationship
- [ ] Justified all filtering decisions
- [ ] Explained visualization choice
- [ ] Analyzed results thoroughly
- [ ] Addressed potential biases
- [ ] Added detailed comments throughout code
- [ ] Submitted to code.org platform 