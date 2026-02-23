const canvasphys = document.getElementById("canvasphys");
const ctxphys = canvasphys.getContext("2d");

// create canvas options
dpr = window.devicePixelRatio;
canvasphys.width = titlediv.clientWidth * dpr;
canvasphys.height = titlediv.clientHeight * dpr;
ctxphys.scale(dpr, dpr);
canvasphys.style.width = `${titlediv.clientWidth}px`;
canvasphys.style.height = `${titlediv.clientHeight}px`;

// Matter.js setup
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

var engine = Engine.create();

var render = Render.create({
    canvas: canvasphys,
    engine: engine,
    options: {
        wireframes: false,
        background: 'transparent'
    }
});

Engine.run(engine);
Render.run(render);