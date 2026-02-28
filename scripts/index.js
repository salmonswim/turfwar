/* 
    some code taken from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
*/

const titlediv = document.getElementById("titlediv");
const socialsdiv = document.getElementById("socialsdiv");
const socialslinks = document.querySelectorAll("a.socials")
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvasbubble = document.getElementById("canvasbubble");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctxbubble = canvasbubble.getContext("2d");
const h1 = document.querySelector("h1");
const discordcopy = document.getElementById("discordcopy");
let dpr = window.devicePixelRatio || 1;

let bigStarfield;
let starfield1;
let starfield2;
let totalStarfield;
let fieldn = 1;
let prevRenderTime;

let timeout;
let numBigStars = Math.floor(titlediv.clientWidth * titlediv.clientHeight / 40000);
let numSmallStars = Math.floor(titlediv.clientWidth * titlediv.clientHeight / 3000);
initCanvas(numBigStars, numSmallStars, true);
window.addEventListener("resize", function() {
    clearTimeout(timeout);
    canvas1.style.display = "none";
    canvas2.style.display = "none";
    numBigStars = Math.floor(titlediv.clientWidth * titlediv.clientHeight / 40000);
    numSmallStars = Math.floor(titlediv.clientWidth * titlediv.clientHeight / 3000);
    initCanvas(numBigStars, numSmallStars, false);
    timeout = setTimeout(function() {
        if (fieldn == 1) canvas1.style.display = "inline";
        else canvas2.style.display = "inline";
    }, 100);
});

let bubbles = [];
for (const link of socialslinks) {
    link.addEventListener("mouseenter", function() {
        for (let i = 0; i < 8; i++) {
            const [x, y, r] = randomBubble(2, 1);
            bubbles.push([x, y, r, 0]);
        }
    });
}

updateBackgroundGradient(0.5, 0.5);
titlediv.addEventListener("mousemove", function(e) {
    updateBackgroundGradient(e.clientX / titlediv.clientWidth, e.clientY / titlediv.clientHeight);
});

/******************** functions for title ********************/

// change titlediv gradient 
function updateBackgroundGradient(xPercent, yPercent) {
    const centerXPercent = 40 + 20 * xPercent;
    const centerYPercent = 150 + 100 * yPercent;
    const centerColor = "#191520";
    const edgeColor = "#0b0e1a";
    titlediv.style.backgroundImage = `radial-gradient(
        circle farthest-side at ${centerXPercent}% ${centerYPercent}%,
        ${centerColor},
        ${centerColor} 50%,
        ${edgeColor} 100%
    )`;
}

// returns random x, y, r values given padding (distance from borders) and base radius +- variability 
function randomStar(padding, baseRadius, radiusVariability) {
    const x = padding + Math.floor(Math.random() * (titlediv.clientWidth - padding * 2));
    const y = padding + Math.floor(Math.random() * (titlediv.clientHeight - padding * 2));
    const r = baseRadius - radiusVariability + Math.floor(Math.random() * (2 * radiusVariability + 1));
    return [x, y, r];
}

// returns false if star values overlap stars in starList or h1 + margin, returns true otherwise
function validStar(starList, starValues, margin) {
    const centerX = titlediv.clientWidth / 2;
    const centerY = titlediv.clientHeight / 2;
    const [starX, starY, r] = starValues;
    if (centerX - (h1.clientWidth / 2) - margin <= starX && starX <= centerX + (h1.clientWidth / 2) + margin &&
        centerY - (h1.clientHeight / 2) - margin <= starY && starY <= centerY + (h1.clientHeight / 2) + margin) return false; // check h1
    for (let i = 0; i < starList.length; i++) {
        let [listX, listY, listR] = starList[i];
        if (listX - listR - (r * 2) <= starX && starX <= listX + listR + (r * 2) &&
            listY - listR - (r * 2) <= starY && starY <= listY + listR + (r * 2)) return false; // check starList
    }
    return true;
}

// returns one star Path2D object at coordinates x, y with arc radius r
function createBigStar(x, y, r) {
    const bigStar = new Path2D;
    let theta = 2 * Math.PI * Math.random();
    bigStar.moveTo(x + (r * Math.cos(theta)), y + (r * Math.sin(theta)));
    for (let i = 0; i < 5; i++) {
        theta += Math.PI * 4 / 5;
        bigStar.lineTo(x + (r * Math.cos(theta)), y + (r * Math.sin(theta)));
    }
    return bigStar;
}

// returns one star Path2D object at coordinates x, y with arc radius r
function createStar(x, y, r) {
    const star = new Path2D;
    star.arc(x - r, y - r, r, 0, Math.PI / 2);
    star.arc(x - r, y + r, r, 3 * Math.PI / 2, 2 * Math.PI);
    star.arc(x + r, y + r, r, Math.PI, 3 * Math.PI / 2);
    star.arc(x + r, y - r, r, Math.PI / 2, Math.PI);
    return star;
}

/******************** functions for socials ********************/

// highlights text when clicking discord link
function discordCopy() {
    navigator.clipboard.writeText('salmonswim');
    discordcopy.style.transition = "none";
    discordcopy.style.color = "#404040";
    setTimeout(function() {
        discordcopy.style.transition = "color 1s";
        discordcopy.style.color = "#202020";
    }, 250);
}

// returns random x, y, r values given base radius +- variability 
function randomBubble(baseRadius, radiusVariability) {
    const x = 10 + Math.floor(Math.random() * (socialsdiv.clientWidth - 10 * 2));
    const y = socialsdiv.clientHeight + 5 + Math.floor(Math.random() * 200);
    const r = baseRadius - radiusVariability + Math.floor(Math.random() * (2 * radiusVariability + 1));
    return [x, y, r];
}

// draws bubbles to canvas and updates position / velocity
function drawBubbles() { 
    ctxbubble.clearRect(0, 0, canvasbubble.width, canvasbubble.height);
    let i = 0;
    while (i < bubbles.length) {
        let [x, y, r, v] = bubbles[i];
        console.log(y);
        ctxbubble.beginPath();
        ctxbubble.arc(x, y, r, 0, 2 * Math.PI);
        ctxbubble.lineWidth = 1;
        ctxbubble.strokeStyle = `rgb(255 255 255 / ${100 * (y / socialsdiv.clientHeight)}%)`;
        ctxbubble.stroke();

        //x += -0.5 + Math.random();
        v += 0.3 * Math.random();
        y -= v;
        if (y > -5) {
            bubbles[i] = [x, y, r, v];
            i++;
        } else {
            bubbles.splice(i, 1);
        }
    }
}

/******************** global functions ********************/

// initialize canvases
function initCanvas(bigStars, numStars, firstCall) {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    dpr = window.devicePixelRatio;
    canvas1.width = titlediv.clientWidth * dpr;
    canvas2.width = titlediv.clientWidth * dpr;
    canvasbubble.width = socialsdiv.clientWidth * dpr;
    canvas1.height = titlediv.clientHeight * dpr;
    canvas2.height = titlediv.clientHeight * dpr;
    canvasbubble.height = socialsdiv.clientHeight * dpr;
    ctx1.scale(dpr, dpr);
    ctx2.scale(dpr, dpr);
    ctxbubble.scale(dpr, dpr);
    canvas1.style.width = `${titlediv.clientWidth}px`;
    canvas1.style.height = `${titlediv.clientHeight}px`;
    canvas2.style.width = `${titlediv.clientWidth}px`;
    canvas2.style.height = `${titlediv.clientHeight}px`;
    canvasbubble.style.width = `${socialsdiv.clientWidth}px`;
    canvasbubble.style.height = `${socialsdiv.clientHeight}px`;

    bigStarfield = [];
    starfield1 = [];
    starfield2 = [];
    totalStarfield = [];

    for (let i = 0; i < bigStars; i++) {
        let bigStarValues = randomStar(30, 20, 10);
        while (validStar(totalStarfield, bigStarValues, 50) == false) bigStarValues = randomStar(30, 20, 10);
        bigStarfield.push(bigStarValues);
        totalStarfield.push(bigStarValues);
    }
    for (let i = 0; i < numStars; i++) {
        let starValues1 = randomStar(30, 3, 2);
        while (validStar(totalStarfield, starValues1, 50) == false) starValues1 = randomStar(30, 3, 2);
        starfield1.push(starValues1);
        totalStarfield.push(starValues1);
    }
    for (let i = 0; i < numStars; i++) {
        let starValues2 = randomStar(30, 3, 2);
        while (validStar(totalStarfield, starValues2, 50) == false) starValues2 = randomStar(30, 3, 2);
        starfield2.push(starValues2);
        totalStarfield.push(starValues2);
    }

    for (let i = 0; i < bigStarfield.length; i++) {
        const [x, y, r] = bigStarfield[i];
        const bigStar = createBigStar(x, y, r);
        ctx1.fillStyle = `rgb(255 255 255 / ${40 - r}%)`;
        ctx2.fillStyle = `rgb(255 255 255 / ${40 - r}%)`;
        ctx1.fill(bigStar);
        ctx2.fill(bigStar);
    }

    for (let i = 0; i < starfield1.length; i++) {
        const [x, y, r] = starfield1[i];
        ctx1.fillStyle = `rgb(255 255 255 / ${60 + 30 * Math.random()}%)`;
        ctx1.fill(createStar(x, y, r));
    }
    for (let i = 0; i < starfield2.length; i++) {
        const [x, y, r] = starfield2[i];
        ctx2.fillStyle = `rgb(255 255 255 / ${60 + 30 * Math.random()}%)`;
        ctx2.fill(createStar(x, y, r));
    }

    if (firstCall) requestAnimationFrame(animate);
}

// animate everything
function animate(timestamp) {
    if (!prevRenderTime) prevRenderTime = timestamp - (120000.0 / 130.0);

    if (timestamp >= prevRenderTime + (120000.0 / 130.0)) {
        if (fieldn == 1) {
            canvas1.style.display = "none";
            canvas2.style.display = "inline";
            fieldn = 2;
            prevRenderTime = timestamp;
        } else {
            canvas1.style.display = "inline";
            canvas2.style.display = "none";
            fieldn = 1;
            prevRenderTime = timestamp;
        }
    }

    if (bubbles.length > 0) drawBubbles();
    else ctxbubble.clearRect(0, 0, canvasbubble.width, canvasbubble.height);

    requestAnimationFrame(animate);
}