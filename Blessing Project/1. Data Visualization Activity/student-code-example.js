
// Global variables for the NBA dataset
var teamNames = [];
var arenaCapacity = [];
var championshipWins = [];
var yearJoined = [];
var cleanData = [];

// Event handlers for buttons
onEvent("loadDataButton", "click", function() {
    loadNBAData();
});

onEvent("analyzeButton", "click", function() {
    performCorrelationAnalysis();
});

onEvent("filterButton", "click", function() {
    filterData();
});

onEvent("biasButton", "click", function() {
    analyzeBias();
});

// Load the NBA Teams dataset
function loadNBAData() {
    try {
        teamNames = getColumn("NBA Teams", "Team");
        arenaCapacity = getColumn("NBA Teams", "Arena capacity");
        championshipWins = getColumn("NBA Teams", "Championship wins");
        yearJoined = getColumn("NBA Teams", "Year joined to the NBA");
        
        if (teamNames && arenaCapacity && championshipWins && yearJoined) {
            setText("dataOutput", "NBA Teams dataset loaded successfully!");
            setText("dataCount", "Total teams: " + teamNames.length);
            createScatterPlot();
        } else {
            setText("dataOutput", "Error: NBA Teams dataset not found. Please add the dataset.");
            setText("dataCount", "No data available");
        }
    } catch (error) {
        setText("dataOutput", "Error: NBA Teams dataset not found. Please add the dataset.");
        setText("dataCount", "No data available");
    }
}

// Filter out bad data
function filterData() {
    if (!teamNames || teamNames.length === 0) {
        setText("filterOutput", "Please load data first");
        return;
    }
    
    cleanData = [];
    
    for (var i = 0; i < teamNames.length; i++) {
        if (arenaCapacity[i] > 0 && championshipWins[i] >= 0 && 
            arenaCapacity[i] != null && championshipWins[i] != null) {
            
            cleanData.push({
                team: teamNames[i],
                capacity: arenaCapacity[i],
                championships: championshipWins[i],
                year: yearJoined[i]
            });
        }
    }
    
    setText("filterOutput", "Filtered data: " + cleanData.length + " valid teams");
    setText("removedCount", "Removed " + (teamNames.length - cleanData.length) + " invalid entries");
    
    createScatterPlot();
}

// Create the scatter plot
function createScatterPlot() {
    var chartData = [];
    var dataToUse = [];
    
    if (cleanData.length > 0) {
        dataToUse = cleanData;
    } else if (teamNames && teamNames.length > 0) {
        for (var i = 0; i < teamNames.length; i++) {
            if (arenaCapacity[i] > 0 && championshipWins[i] >= 0) {
                dataToUse.push({
                    team: teamNames[i],
                    capacity: arenaCapacity[i],
                    championships: championshipWins[i],
                    year: yearJoined[i]
                });
            }
        }
    }
    
    // Create a text-based visualization since chart is not available
    var visualizationText = "NBA TEAMS DATA VISUALIZATION:\n\n";
    visualizationText += "Arena Capacity vs Championship Wins:\n";
    visualizationText += "=====================================\n\n";
    
    for (var i = 0; i < dataToUse.length; i++) {
        var dataPoint = dataToUse[i];
        visualizationText += dataPoint.team + ":\n";
        visualizationText += "  Arena Capacity: " + dataPoint.capacity + " seats\n";
        visualizationText += "  Championships: " + dataPoint.championships + "\n";
        visualizationText += "  Year Joined: " + dataPoint.year + "\n";
        visualizationText += "  ---\n";
    }
    
    // Display the visualization in the chart area
    setText("priceRatingChart", visualizationText);
    
    // Also show summary statistics
    var totalCapacity = 0;
    var totalChampionships = 0;
    for (var i = 0; i < dataToUse.length; i++) {
        totalCapacity += dataToUse[i].capacity;
        totalChampionships += dataToUse[i].championships;
    }
    
    var avgCapacity = totalCapacity / dataToUse.length;
    var avgChampionships = totalChampionships / dataToUse.length;
    
    setText("dataOutput", "Data loaded: " + dataToUse.length + " teams | Avg Capacity: " + Math.round(avgCapacity) + " | Avg Championships: " + avgChampionships.toFixed(1));
}

// Calculate correlation coefficient
function calculateCorrelation() {
    if (cleanData.length < 2) {
        return 0;
    }
    
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    var n = cleanData.length;
    
    for (var i = 0; i < n; i++) {
        var x = cleanData[i].capacity;
        var y = cleanData[i].championships;
        
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
        sumY2 += y * y;
    }
    
    var numerator = n * sumXY - sumX * sumY;
    var denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) {
        return 0;
    }
    
    return numerator / denominator;
}

// Do the correlation analysis
function performCorrelationAnalysis() {
    if (cleanData.length === 0) {
        filterData();
    }
    
    if (cleanData.length < 2) {
        setText("correlationResult", "Error: Not enough valid data for correlation analysis");
        setText("interpretation", "Please load and filter data first");
        setText("explanation", "");
        return;
    }
    
    var correlation = calculateCorrelation();
    
    setText("correlationResult", "Correlation Coefficient: " + correlation.toFixed(3));
    
    var interpretation = "";
    if (correlation > 0.7) {
        interpretation = "Strong positive correlation";
    } else if (correlation > 0.3) {
        interpretation = "Moderate positive correlation";
    } else if (correlation > -0.3) {
        interpretation = "Weak or no correlation";
    } else if (correlation > -0.7) {
        interpretation = "Moderate negative correlation";
    } else {
        interpretation = "Strong negative correlation";
    }
    
    setText("interpretation", "Interpretation: " + interpretation);
    
    var explanation = "";
    if (correlation > 0.3) {
        explanation = "This suggests that teams with larger arenas tend to have more championship wins.";
    } else if (correlation < -0.3) {
        explanation = "This suggests that teams with smaller arenas tend to have more championship wins.";
    } else {
        explanation = "This suggests there is little relationship between arena size and championship success.";
    }
    
    setText("explanation", explanation);
}

// Check for bias in the data
function analyzeBias() {
    if (cleanData.length === 0 && (!teamNames || teamNames.length === 0)) {
        setText("biasOutput", "Please load data first before analyzing bias.");
        return;
    }
    
    var dataToAnalyze = (cleanData.length > 0) ? cleanData : [];
    if (dataToAnalyze.length === 0 && teamNames && teamNames.length > 0) {
        for (var i = 0; i < teamNames.length; i++) {
            if (arenaCapacity[i] > 0 && championshipWins[i] >= 0) {
                dataToAnalyze.push({
                    team: teamNames[i],
                    capacity: arenaCapacity[i],
                    championships: championshipWins[i],
                    year: yearJoined[i]
                });
            }
        }
    }
    
    if (dataToAnalyze.length === 0) {
        setText("biasOutput", "No valid data available for bias analysis.");
        return;
    }
    
    var biasAnalysis = "POTENTIAL BIAS ANALYSIS:\n\n";
    
    // Check selection bias
    biasAnalysis += "1. Selection Bias: ";
    if (cleanData.length > 0 && cleanData.length < teamNames.length * 0.8) {
        biasAnalysis += "We removed " + (teamNames.length - cleanData.length) + " teams. ";
        biasAnalysis += "This might bias our results if removed teams had different patterns.\n\n";
    } else if (cleanData.length > 0) {
        biasAnalysis += "Minimal selection bias - most teams were retained.\n\n";
    } else {
        biasAnalysis += "Using original data without filtering.\n\n";
    }
    
    // Check conference distribution
    var easternTeams = 0;
    var westernTeams = 0;
    for (var i = 0; i < dataToAnalyze.length; i++) {
        if (dataToAnalyze[i].team.includes("Eastern") || 
            ["Boston Celtics", "Brooklyn Nets", "New York Knicks", "Philadelphia 76ers", 
             "Toronto Raptors", "Chicago Bulls", "Cleveland Cavaliers", "Detroit Pistons",
             "Indiana Pacers", "Milwaukee Bucks", "Atlanta Hawks", "Charlotte Hornets",
             "Miami Heat", "Orlando Magic", "Washington Wizards"].indexOf(dataToAnalyze[i].team) !== -1) {
            easternTeams++;
        } else {
            westernTeams++;
        }
    }
    
    biasAnalysis += "2. Conference Distribution: " + easternTeams + " Eastern, " + westernTeams + " Western teams. ";
    if (Math.abs(easternTeams - westernTeams) > 5) {
        biasAnalysis += "Uneven conference distribution might affect results.\n\n";
    } else {
        biasAnalysis += "Good conference balance for analysis.\n\n";
    }
    
    // Check arena capacity range
    var minCapacity = dataToAnalyze[0].capacity;
    var maxCapacity = dataToAnalyze[0].capacity;
    for (var i = 1; i < dataToAnalyze.length; i++) {
        if (dataToAnalyze[i].capacity < minCapacity) minCapacity = dataToAnalyze[i].capacity;
        if (dataToAnalyze[i].capacity > maxCapacity) maxCapacity = dataToAnalyze[i].capacity;
    }
    
    biasAnalysis += "3. Arena Capacity Range: " + minCapacity + " to " + maxCapacity + " seats. ";
    biasAnalysis += "This represents typical NBA arena sizes.\n\n";
    
    // Check championship distribution
    var totalChampionships = 0;
    var teamsWithChampionships = 0;
    for (var i = 0; i < dataToAnalyze.length; i++) {
        totalChampionships += dataToAnalyze[i].championships;
        if (dataToAnalyze[i].championships > 0) {
            teamsWithChampionships++;
        }
    }
    var avgChampionships = totalChampionships / dataToAnalyze.length;
    
    biasAnalysis += "4. Championship Distribution: " + teamsWithChampionships + " teams have won championships. ";
    biasAnalysis += "Average championships per team: " + avgChampionships.toFixed(1) + ".\n\n";
    
    biasAnalysis += "CONCLUSION: Consider these biases when interpreting results.";
    
    setText("biasOutput", biasAnalysis);
}
