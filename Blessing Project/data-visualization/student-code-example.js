// Data Visualization Analysis - Ramen Price vs Rating Correlation
// Purpose: Analyze whether more expensive ramen brands receive higher ratings
// Author: BLESSING KAMALEBO MABULAY
// Date: January 2024
// Class: Computer Science Principles
// Assignment: Unit 5 Lesson 8 - Data Visualization Activity

// I chose to analyze the relationship between ramen price and rating because
// this is a practical question that many students and consumers wonder about.
// Does paying more actually get you better quality ramen?

// Step 1: Load the dataset from code.org
// I'm using the ramen dataset because it has good price and rating data
var ramenBrands = getColumn("ramen", "Brand");
var ramenPrices = getColumn("ramen", "Price");
var ramenRatings = getColumn("ramen", "Stars");

// Let's see how much data we have to work with
console.log("Dataset loaded with " + ramenBrands.length + " ramen brands");

// Step 2: Clean the data by removing missing or invalid entries
// I need to filter out any brands that don't have price or rating information
// because missing data would mess up my analysis
var cleanData = [];
for (var i = 0; i < ramenBrands.length; i++) {
    // Only include brands that have both price and rating data
    if (ramenPrices[i] !== null && ramenRatings[i] !== null && 
        ramenPrices[i] > 0 && ramenRatings[i] > 0) {
        cleanData.push({
            brand: ramenBrands[i],
            price: ramenPrices[i],
            rating: ramenRatings[i]
        });
    }
}

console.log("After cleaning, we have " + cleanData.length + " valid data points");

// Step 3: Create a scatter plot to visualize the relationship
// I'm using a scatter plot because it's the best way to show if two variables
// are related to each other. Each point represents one ramen brand.
var priceRatingChart = new Chart("priceRatingChart", {
    type: "scatter",
    data: {
        datasets: [{
            label: "Ramen Brands",
            data: cleanData.map(function(brand) {
                return {x: brand.price, y: brand.rating};
            }),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)"
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Price (USD)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Rating (Stars)"
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Ramen Price vs Rating Analysis"
            }
        }
    }
});

// Step 4: Calculate the correlation coefficient
// This will give us a number between -1 and 1 that tells us how strong
// the relationship is between price and rating
var correlation = calculateCorrelation(cleanData);
console.log("Correlation coefficient: " + correlation.toFixed(3));

// Step 5: Interpret the results
// Based on the correlation coefficient, I can make conclusions about the data
if (correlation > 0.5) {
    console.log("There is a strong positive correlation between price and rating");
    console.log("This means more expensive ramen tends to have higher ratings");
} else if (correlation > 0.3) {
    console.log("There is a moderate positive correlation between price and rating");
    console.log("This suggests that price and quality are somewhat related");
} else if (correlation > -0.3) {
    console.log("There is little correlation between price and rating");
    console.log("This means price doesn't really predict quality");
} else {
    console.log("There is a negative correlation between price and rating");
    console.log("This is surprising - cheaper ramen has higher ratings!");
}

// Helper function to calculate correlation coefficient
// I found this formula online and adapted it for my data
function calculateCorrelation(data) {
    if (data.length < 2) return 0;
    
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
    // Calculate sums needed for the correlation formula
    for (var i = 0; i < data.length; i++) {
        sumX += data[i].price;
        sumY += data[i].rating;
        sumXY += data[i].price * data[i].rating;
        sumX2 += data[i].price * data[i].price;
        sumY2 += data[i].rating * data[i].rating;
    }
    
    var n = data.length;
    var numerator = n * sumXY - sumX * sumY;
    var denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Step 6: Address potential bias in the data
// It's important to think about where this data comes from and what might be wrong with it
console.log("\n=== BIAS ANALYSIS ===");
console.log("Potential biases in this dataset:");
console.log("1. Selection bias: This dataset might not include all ramen brands");
console.log("2. Rating bias: Ratings might be influenced by brand popularity");
console.log("3. Price bias: Prices might not reflect current market prices");
console.log("4. Cultural bias: Ratings might be influenced by cultural preferences");

console.log("\nThese biases could affect my conclusions because:");
console.log("- If popular brands are overrepresented, the correlation might be misleading");
console.log("- If prices are outdated, the relationship might have changed");
console.log("- If ratings are biased, they might not reflect actual quality");

// My conclusion: While there appears to be some relationship between price and rating,
// I need to be careful about making strong claims because of these potential biases.
// This analysis shows a pattern, but more research would be needed to make
// confident recommendations about ramen purchasing decisions. 