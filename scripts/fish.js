let score = 0;
createFish();

function fishClick() {
    document.getElementById("fish").remove();
    document.getElementById("fishscore").textContent = "Score: " + (++score);
    createFish();
}

function createFish() {
    const fishgrid = document.getElementById("fishgrid");
    const fish = document.createElement("a");
    fishgrid.appendChild(fish);
    fish.textContent = "🐟";
    fish.id = "fish";
    fish.onclick = fishClick;
    fish.style.cursor = "pointer";
    fish.style.gridRow = Math.floor(Math.random() * 10) + 1;
    fish.style.gridColumn = Math.floor(Math.random() * 10) + 1;
}
