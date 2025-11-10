// List of icons to randomly choose between
var iconIndex = 0;
var iconsList = ["icon://fa-heart",
"icon://fa-music",
"icon://fa-smile-o",
"icon://fa-globe",
"icon://fa-tree",
"icon://fa-bolt",
"icon://fa-moon-o",
"icon://fa-star"];

// Initialize the app by calling changeShapes on startup
changeShapes();

// Event handler for the shapes button
onEvent("shapesButton", "click", function() {
    changeShapes();
});

// Event handler for the locations button
onEvent("locationsButton", "click", function() {
    changeLocations();
});

// Function to change all icons to a new random shape
function changeShapes() {
    var lastIndex = iconIndex;
    iconIndex = randomNumber(0, iconsList.length - 1);
    
    // Keep picking a new random index until it's different from the last one
    while (iconIndex == lastIndex) {
        iconIndex = randomNumber(0, iconsList.length - 1);
    }
    
    // Loop through all 20 icons to assign the new image
    for (var i = 0; i < 20; i++) {
        setProperty("icon" + i, "image", iconsList[iconIndex]);
    }
}

// Function to change the locations of all icons randomly
function changeLocations() {
    // Loop through all 20 icons to reposition them
    for (var i = 0; i < 20; i++) {
        setProperty("icon" + i, "x", randomNumber(0, 300));
        setProperty("icon" + i, "y", randomNumber(0, 430));
        setProperty("icon" + i, "width", randomNumber(30, 300));
        setProperty("icon" + i, "height", randomNumber(30, 300));
    }
}

// Event handler for the colors button
onEvent("colorsButton", "click", function() {
    changeColors();
});

// Function to change colors of all icons and background randomly
function changeColors() {
    // Loop through all 20 icons to change their colors
    for (var i = 0; i < 20; i++) {
        var red = randomNumber(0, 255);
        var green = randomNumber(0, 255);
        var blue = randomNumber(0, 255);
        
        setProperty("icon" + i, "icon-color", rgb(red, green, blue, 0.5));
        setProperty("homeScreen", "background-color", rgb(randomNumber(0, 255), randomNumber(0, 255), randomNumber(0, 255), 0.5));
    }
}
