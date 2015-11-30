var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var windowWidth = document.defaultView.innerWidth;
var windowHeight = document.defaultView.innerHeight;
canvas.height = windowHeight;
canvas.width = windowWidth;
var Renderer = require('./renderer');
var Entity = require('./entity');

var Render = new Renderer(context, 25, 14);
var Player = new Entity(Render, true);

window.addEventListener('resize', Render.refreshDimensions, false);
window.addEventListener('keypress', Player.keyPressed, false);

var gameLoop = setInterval(Render.draw, 40);