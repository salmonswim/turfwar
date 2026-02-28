/* 
    note: loaded after index.js --> variables carry
*/

const canvasphys = document.getElementById("canvasphys");
canvasphys.width = titlediv.clientWidth * dpr;
canvasphys.height = titlediv.clientHeight * dpr;
canvasphys.style.width = `${titlediv.clientWidth}px`;
canvasphys.style.height = `${titlediv.clientHeight}px`;

// Matter.js setup

const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Events = Matter.Events;

const engine = Engine.create();
engine.gravity.y = 1.5 * dpr;
const render = Render.create({
    canvas: canvasphys,
    engine: engine,
    options: {
        width: canvasphys.width,
        height: canvasphys.height,
        //devicePixelRatio: dpr, // pretty sure this doesn't do anything
        wireframes: false,
        background: 'transparent'
    }
});
const runner = Runner.create();

let rectangle; // defined outside to use on resize later
const walls = [];
let posX = [canvasphys.width / 2, canvasphys.width / 2, -100, canvasphys.width + 100];
let posY = [-100, canvasphys.height + 100, canvasphys.height / 2, canvasphys.height / 2];
let sizeX = [canvasphys.width * 2, canvasphys.width * 2, 200, 200];
let sizeY = [200, 200, canvasphys.height * 2, canvasphys.height * 2];

// create salmonswim texture (canvas)

document.fonts.ready.then(function() { // note: everything needs to happen after bitcount is loaded or texture is wrong
    const texture = document.createElement('canvas');
    const ctxture = texture.getContext('2d');
    const fakefontdpi = 2 * dpr;

    ctxture.font = `${5 * fakefontdpi}em 'Bitcount Single', monospace`;
    texture.width = ctxture.measureText("salmonswim").width; 
    texture.height = 80 * fakefontdpi / 2;

    ctxture.font = `${5 * fakefontdpi}em 'Bitcount Single', monospace`;
    ctxture.fillStyle = 'white';
    ctxture.textAlign = 'center';
    ctxture.textBaseline = 'top';

    ctxture.fillText("salmonswim", texture.width / 2 + 3, 3);

    // create objects

    const scaleFactor = h1.clientWidth / texture.width;

    rectangle = Bodies.rectangle(
        (canvasphys.width / 2) - (1 * dpr), (canvasphys.height / 2) - (7 * dpr), // position
        texture.width * scaleFactor * dpr, texture.height * scaleFactor * dpr, // size 
        {
            render: {
                fillStyle: "#ffffff30",
                sprite: {
                    texture: texture.toDataURL(),
                    xScale: scaleFactor * dpr, 
                    yScale: scaleFactor * dpr
                },
            },
            restitution: 0.2
        }
    );

    for (let i = 0; i < 4; i++) {
        walls[i] = Bodies.rectangle(posX[i], posY[i], sizeX[i], sizeY[i], {isStatic: true});
    }

    // create mouse interaction

    const mouse = Mouse.create(canvasphys);
    const mouseConstraint = MouseConstraint.create(
        engine,
        {
            mouse: mouse,
            constraint: {
                stiffness: 0.05,
                angularStiffness: 0, 
                render: {
                    visible: false
                }
            }
        }
    );

    // render 

    for (let i = 0; i < 4; i++) {
        Composite.add(engine.world, walls[i]);
    }
    Composite.add(engine.world, [rectangle, mouseConstraint]);
});

// run (on click)

function enable_phys() {
    h1.style.display = "none";
    Render.run(render);
    Runner.run(runner, engine);
    if (canvasphys.width != titlediv.clientWidth * dpr || canvasphys.height != titlediv.clientHeight * dpr) {
        resize_phys();
        Body.setPosition(rectangle, {
            x: (canvasphys.width / 2) - (1 * dpr), 
            y: (canvasphys.height / 2) - (7 * dpr)
        });
    }
    window.addEventListener("resize", resize_phys);
}

h1.addEventListener("mousedown", enable_phys);

// handle resizing

function resize_phys() {
    canvasphys.width = titlediv.clientWidth * dpr;
    canvasphys.height = titlediv.clientHeight * dpr;
    canvasphys.style.width = `${titlediv.clientWidth}px`;
    canvasphys.style.height = `${titlediv.clientHeight}px`;
    render.bounds.max.x = canvasphys.width;
    render.bounds.max.y = canvasphys.height;
    render.options.width = canvasphys.width;
    render.options.height = canvasphys.height;

    posX = [canvasphys.width / 2, canvasphys.width / 2, -100, canvasphys.width + 100];
    posY = [-100, canvasphys.height + 100, canvasphys.height / 2, canvasphys.height / 2];
    for (let i = 0; i < 4; i++) {
        Body.setPosition(walls[i], {
            x: posX[i],
            y: posY[i]
        });
    }
};