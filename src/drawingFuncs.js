
import {getRelativeCoords, keyMap, Camera } from "./modules/camera.js";


let canvas;
let camera;
let fillColour;
let lineColour;
let context;
let circles = [];
let _lineWidth = 1;
let _fontSize = 10;
let _relativeFontSize = 10;
let alphaA = "abcdefghijklmnopqrstuvwxyz".split("");
let nodes = [];

setup();
//Setup For The Main Method.
function setup()
{
    createCanvas(window.innerWidth, window.innerHeight);
    
    main();
}

function createCanvas(width, height)
{
    canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = width;
    canvas.height = height; 
    document.body.appendChild(canvas);

}


function main()
{
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext('2d');
    
    camera = new Camera(0,0, window.innerWidth, window.innerHeight);
    
    camera.setHorizontalControl(true);
    camera.setVerticalControl(true);
    setTextDrawingPoint("middle");
    setFontSize(130);
    camera.addExecuteAfterZoom(_updateFontSize);
    camera.addExecuteAfterZoom(_updateLineWidth);
    window.addEventListener('onclick', click);
    fillColour = 'black';
    lineColour = 'black';

    for(let i = 0; i < alphaA.length; i++)
    {
        let x = ((i * 200) % 1000) + (i % 5) * 50;
        let y = (Math.floor(i/5) * 200);
        let letter = alphaA[i];
        nodes.push({x: x, y: y, letter : letter});
    }

    window.requestAnimationFrame(update);
    
}
function click(e)
{
    
}
function setColour(colour)
{
    context.strokeStyle = colour;
}
function setFillColour(colour)
{
    context.fillStyle = colour;
}
function drawCircle(x,y, radius, fill)
{
    let coords = getRelativeCoords(x,y,camera);
    fill = fill === true ? true : false;
    radius *= camera.zoomScale;
    context.beginPath();
    context.arc(coords.x,coords.y,radius,0, 2*Math.PI);
    if(fill)
    {
        context.fill();
    }
    context.stroke();
    context.closePath();
}
function drawRect(x,y, width, height, fill)
{
    let coords = getRelativeCoords(x,y,camera);
    fill = fill === true ? true : false;
    width *= camera.zoomScale;
    height *= camera.zoomScale;
    context.beginPath();
    context.rect(coords.x, coords.y, width, height);
    context.stroke()
    if(fill)
    {
        context.fill();
    }
    context.closePath();
}
function setTextDrawingPoint(drawingPoint)
{
    switch(drawingPoint)
    {
        case "middle":
            context.textBaseline = 'middle';
            context.textAlign = "center";
            break;
        case "topLeft":
            context.textAlign = "left";
            context.textBaseline = "top";
            break;

        default:
            break;
    }
}
function setLineWidth(width)
{
    _lineWidth = width;
    _updateLineWidth();
}
function _updateLineWidth()
{
    context.lineWidth = _lineWidth * camera.zoomScale;
}

function setFontSize(fontSize)
{
    _fontSize = fontSize;
    _updateFontSize();
}
function _updateFontSize()
{
    _relativeFontSize = _fontSize * camera.zoomScale;
}
function drawText(x,y, message)
{
    let coords = getRelativeCoords(x,y, camera);
    let fontSize = _relativeFontSize + 'px';
    context.font = fontSize + ' ' + 'Arial';
    
    context.fillText(message, coords.x, coords.y);
}
function drawLine(xInitial, yInitial, xEnd, yEnd)
{
    
    let coordsInitial = getRelativeCoords(xInitial, yInitial, camera);
    let coordsEnd = getRelativeCoords(xEnd, yEnd, camera);
    context.beginPath();
    context.moveTo(coordsInitial.x, coordsInitial.y);
    context.lineTo(coordsEnd.x, coordsEnd.y);
    context.stroke();
    context.closePath();
}
function draw()
{
    setColour("black");
    setLineWidth(20);
    drawLine(0,0, 200, 0);
    setLineWidth(1);
    drawRect(0, 0, 100, 100, false);
    for(let i = 0; i < nodes.length; i++)
    {
        let node = nodes[i];
        drawNode(node.x,node.y, node.letter);
    }
    
    
        
    
}
function drawNode(x,y, letter)
{
    setFillColour('red');
    drawCircle(x,y,100,true);
    setFillColour("brown");
    drawCircle(x,y, 70, true);
    setFillColour("black");
    drawText(x,y,letter); 
}

function update()
{
    clear();

    camera.update();
    draw();
    window.document.title = "X: " + Math.floor(camera.x) + " Y: " + Math.floor(camera.y);

    window.requestAnimationFrame(update);
}
function clear()
{
    context.clearRect(0,0, window.innerWidth, window.innerHeight);
}