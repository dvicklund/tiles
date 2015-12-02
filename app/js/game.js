// Grab canvas element from HTML, then grab its context.
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Set width and height of the canvas element to fill the viewport
var windowWidth = canvas.width = document.defaultView.innerWidth;
var windowHeight = canvas.height = document.defaultView.innerHeight;

// Grab renderer and entity modules
var Renderer = require('./renderer');
var Entity = require('./entity');

// Set up the renderer and player
var Render = new Renderer(context, Math.round(windowWidth/25), Math.round(windowHeight/25));
var Player = new Entity(Render, true);

// Add window listeners for resizing canvas dimensions and player controls
window.addEventListener('resize', Render.refreshDimensions, false);
window.addEventListener('keypress', Player.keyPressed, false);

// Initialize infinite drawing loop
Render.draw();
