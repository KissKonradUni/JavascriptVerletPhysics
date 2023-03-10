const mainCanvas = document.getElementById("mainCanvas");
/** @type {CanvasRenderingContext2D} */
const context = mainCanvas.getContext("2d");
const screenSize = new Vector2(1920, 1080);

context.font = "24px Lucida Console";

let entities = {
    list: [ 

    ]
};
const evt = setInterval(() => {
    let ent = new Entity(new Vector2(16, 64), new Vector2(16, 16));
    ent.accelerate(new Vector2(30000, 0));
    entities.list.push(ent);

    if (entities.list.length > 1000)
        clearInterval(evt);
}, 50);

let previousTime = 0;
let deltaTime = 0;
function render(time) {
    deltaTime = (time - previousTime) / 1000;
    previousTime = time;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, screenSize.x, screenSize.y);
    context.fillStyle = "#000";
    context.fillText(`Frame time: ${(deltaTime * 1000).toFixed(2)}ms`, 6, 24);
    context.fillText(`Physics time: ${lastPhysicsTime.toFixed(2)}ms`, 400, 24);
    context.fillText(`Object count: ${entities.list.length}`, 800, 24);

    context.fillStyle = "#f00";
    context.strokeStyle = "#000";
    context.lineWidth = 1.0;
    entities.list.forEach((ent) => {
        context.beginPath();

        (ent.shape.equals(EnumShapeCircle)) ? 
            context.ellipse(ent.position.x, ent.position.y, ent.size.x, ent.size.x, 0, 0, Math.PI * 2) :
            context.rect(ent.position.x - ent.size.x / 2, ent.position.y - ent.size.y / 2, ent.size.x, ent.size.y);

        context.fill();
        context.stroke();
    });

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);

const physicsSolver = new PhysicsSolver(entities);
const physicsDelta = 1 / 32;
const physicsSubsteps = 4;
let lastPhysicsTime = 0;

setInterval(() => {
    let start = performance.now();
    physicsSolver.update(physicsDelta, physicsSubsteps);
    lastPhysicsTime = (performance.now() - start);
}, physicsDelta);