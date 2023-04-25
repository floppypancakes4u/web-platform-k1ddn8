//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');

import { Actor } from './actor.js';
import { ActorClasses } from './actors.js';

const cellSize = 100;
const LEFT_MOUSE = 0;
const RIGHT_MOUSE = 2;

let mouseX, mouseY, lastMouseX, lastMouseY;
let mouseCurX, mouseCurY;
let leftMouseDown, rightMouseDown;

const World = {
  canvas: document.getElementById('canvas'),
  ctx: canvas.getContext('2d'),
  Init() {},
  DrawBackground() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  Draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.DrawBackground();

    drawGrid();
    //drawPlanets();

    let noObjectFound = true;

    // Draw actors
    actors.forEach((actor) => {
      actor.tick();
      actor.draw(World);

      if (noObjectFound && this.ctx.isPointInPath(mouseCurX, mouseCurY)) {
        if (leftMouseDown) {
          Camera.setSelectedActor(actor);
          //actor.setTargetState('targetingMe');
        }
        actor.showEntityDetails();

        //Update the output div
        noObjectFound = false;
      }
    });
  },

  Tick() {},
};

const Camera = {
  X: 0,
  Y: 0,
  selectedActor: null,
  targetedActors: [],

  setSelectedActor(actor) {
    if (this.selectedActor != null) {
      //actor.setTargetState(false);
      this.selectedActor.setSelected(false);
    }

    this.selectedActor = actor;
    this.selectedActor.setSelected(true);
    //actor.setTargetState('selected');
  },

  clearSelectedActor() {
    this.selectedActor = null;
  },

  move(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const deltaX = mouseX - lastMouseX;
    const deltaY = mouseY - lastMouseY;

    Camera.X -= deltaX;
    Camera.Y -= deltaY;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  },
};

World.canvas.width = window.innerWidth;
World.canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  World.canvas.width = window.innerWidth;
  World.canvas.height = window.innerHeight;
});

World.canvas.addEventListener('mousedown', (e) => {
  if (e.button === LEFT_MOUSE) {
    leftMouseDown = true;
  }
  if (e.button === RIGHT_MOUSE) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    rightMouseDown = true;
    World.canvas.addEventListener('mousemove', Camera.move);
  }
});

World.canvas.addEventListener('mouseup', (e) => {
  if (e.button === LEFT_MOUSE) {
    leftMouseDown = false;
  }
  if (e.button === RIGHT_MOUSE) {
    rightMouseDown = false;

    World.canvas.removeEventListener('mousemove', Camera.move);
  }
});

World.canvas.addEventListener('mousemove', (e) => {
  mouseCurX = e.clientX;
  mouseCurY = e.clientY;
});

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

function drawGrid() {
  const startX = Math.floor(Camera.X / cellSize) * cellSize;
  const startY = Math.floor(Camera.Y / cellSize) * cellSize;

  World.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

  for (let x = startX; x < World.canvas.width + cellSize; x += cellSize) {
    for (let y = startY; y < World.canvas.height + cellSize; y += cellSize) {
      World.ctx.beginPath();
      World.ctx.rect(x - Camera.X, y - Camera.Y, cellSize, cellSize);
      World.ctx.stroke();
    }
  }
}

// class Actor {
//   constructor({ x = 0, y = 0, size = 30, color = 'grey' }) {
//     this.x = x;
//     this.y = y;
//     this.size = size;
//     this.color = color;
//     this.orbitActor = null;
//     this.orbitPosition = null;
//     this.orbitSpeed = 0.005;
//     this.orbitAngle = 100 * Math.random();
//     this.orbitDistance = 100;
//     this.camera = null;
//     this.selected = false;
//     this.showingData = false;
//     this.targetingState = false;
//     this.targetStateOpacity = 0;
//     this.targetStateInterval = null;
//     this.time = 0;
//   }

//   setSelected(state) {
//     this.selected = state;
//   }

//   setTargetState(state) {
//     this.targetingState = state;
//     console.log('Target state set to ', state);
//   }

//   setOrbitActor(actor) {
//     this.orbitActor = actor;
//   }

//   setOrbitPosition(x, y) {
//     this.orbitPosition = { x, y };
//   }

//   setOrbitSpeed(speed) {
//     this.orbitSpeed = speed;
//   }

//   setOrbitAngle(angle) {
//     this.orbitAngle = angle;
//   }

//   setOrbitDistance(distance) {
//     this.orbitDistance = distance;
//   }

//   init(camera) {
//     this.camera = camera;
//   }

//   tick() {
//     // Update Pulse time if active
//     if (this.selected || this.targetingState) {
//       this.targetStateOpacity = Math.sin(this.time) * amplitude + 0.575; // 0.575 = (1.0 + 0.15) / 2
//       this.time += frequency;
//     }
//   }

//   draw() {
//     // This has to be drawn first, otherwise the actor itself won't be detected by mouseover events
//     this.drawHoverReticle();

//     if (this.orbitActor) {
//       // If orbiting an actor
//       this.orbitAngle += this.orbitSpeed;
//       const orbitX =
//         this.orbitActor.x + this.orbitDistance * Math.cos(this.orbitAngle);
//       const orbitY =
//         this.orbitActor.y + this.orbitDistance * Math.sin(this.orbitAngle);
//       this.x = orbitX;
//       this.y = orbitY;
//     } else if (this.orbitPosition) {
//       // If orbiting a position
//       this.orbitAngle += this.orbitSpeed;
//       const orbitX =
//         this.orbitPosition.x + this.orbitDistance * Math.cos(this.orbitAngle);
//       const orbitY =
//         this.orbitPosition.y + this.orbitDistance * Math.sin(this.orbitAngle);
//       this.x = orbitX;
//       this.y = orbitY;
//     }

//     const canvasPos = this.getcanvasPosition();
//     World.ctx.beginPath();
//     World.ctx.arc(canvasPos.x, canvasPos.y, this.size, 0, 2 * Math.PI);
//     World.ctx.fillStyle = this.color;
//     World.ctx.fill();

//     if (this.selected) this.showEntityDetails();
//   }

//   drawHoverReticle() {
//     if (this.targetingState == false && this.selected == false) return;

//     const canvasPos = this.getcanvasPosition();

//     World.ctx.strokeStyle = `rgba(25, 255, 255, ${this.targetStateOpacity})`;
//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y - this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x - this.size * 0.75,
//       canvasPos.y - this.size * 1.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y - this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y - this.size * 0.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x + this.size * 1.75,
//       canvasPos.y - this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x + this.size * 0.75,
//       canvasPos.y - this.size * 1.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x + this.size * 1.75,
//       canvasPos.y - this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x + this.size * 1.75,
//       canvasPos.y - this.size * 0.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y + this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x - this.size * 0.75,
//       canvasPos.y + this.size * 1.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y + this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y + this.size * 0.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x + this.size * 1.75,
//       canvasPos.y + this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x + this.size * 0.75,
//       canvasPos.y + this.size * 1.75
//     );
//     World.ctx.stroke();

//     World.ctx.beginPath();
//     World.ctx.moveTo(
//       canvasPos.x + this.size * 1.75,
//       canvasPos.y + this.size * 1.75
//     );
//     World.ctx.lineTo(
//       canvasPos.x + this.size * 1.75,
//       canvasPos.y + this.size * 0.75
//     );
//     World.ctx.stroke();
//   }

//   showEntityDetails() {
//     const canvasPos = this.getcanvasPosition();

//     World.ctx.fillStyle = 'white';
//     World.ctx.fillText(
//       `X: ${this.x.toFixed(2)} Y: ${this.y.toFixed(2)}`,
//       canvasPos.x - this.size * 1.75,
//       canvasPos.y - this.size * 1.75
//     );
//   }

//   getcanvasPosition() {
//     return { x: this.x - this.camera.X, y: this.y - this.camera.Y };
//   }
// }

// function drawStrokedText(text, x, y)
// {
//   //World.ctx.font = "80px Sans-serif";
//   //World.ctx.fillStyle = "white";

//         // using the solutions from @Simon Sarris and @Jackalope from
//     // https://stackoverflow.com/questions/7814398/a-glow-effect-on-html5-World.canvas
//         World.ctx.save();
//     World.ctx.strokeStyle = 'black';
//     World.ctx.lineWidth = 8;
//     World.ctx.lineJoin="round";
//       World.ctx.miterLimit=2;
//     World.ctx.strokeText(text, x, y);
//     World.ctx.fillText(text, x, y);
//     World.ctx.restore();
// }

// function drawShadowedText(text, x, y, shadowBlur = 3)
// {
//         World.ctx.save();
//     World.ctx.shadowBlur = shadowBlur;
//     World.ctx.shadowColor = "#000000";
//     World.ctx.shadowOffsetX = 4;
//     World.ctx.shadowOffsetY = 4;
//     World.ctx.fillText(text, x, y);
//     World.ctx.restore();
// }

// function drawGlowingText(text, x, y, glowColorHexString, glowDistance = 10)
// {
//         World.ctx.save();
//     World.ctx.shadowBlur = glowDistance;
//     World.ctx.shadowColor = glowColorHexString;
//     World.ctx.strokeText(text, x, y);

//     for(let i = 0; i < 3; i++)
//         World.ctx.fillText(text, x, y); //seems to be washed out without 3 fills

//     World.ctx.restore();
// }

// function drawBlurredText(text, x, y, blur = 5)
// {
//     //using technique from https://www.html5rocks.com/en/tutorials/World.canvas/texteffects/
//     World.ctx.save();
//   let width = World.ctx.measureText(text).width + blur * 2;
//   World.ctx.shadowColor = World.ctx.fillStyle;
//   World.ctx.shadowOffsetX = width + x + World.ctx.World.canvas.width;
//   World.ctx.shadowOffsetY = 0;
//   World.ctx.shadowBlur = blur;
//   World.ctx.fillText(text, -width + -World.ctx.World.canvas.width, y);
//   World.ctx.restore();
// }

// function drawReflectedText(text, x, y, reflectionScale = 0.2, reflectionAlpha = 0.10)
// {
//     World.ctx.save();
//   World.ctx.fillText(text, x, y);
//     World.ctx.scale(1, -reflectionScale);
//   World.ctx.globalAlpha = reflectionAlpha;
//   World.ctx.shadowColor = World.ctx.fillStyle;
//   World.ctx.shadowBlur = 15;
//     World.ctx.fillText(text, x, -(y * (1 / reflectionScale)));
//   World.ctx.restore();
// }

const actors = [];
const asteroidCount = 305;

// const taco = new Actor({ x: 10, y: 10, color: 'yellow' });
// actors.push(taco);
// taco.init(World, Camera);

// const testPlanet1 = new Actor({ x: 15, y: 15, color: 'blue' });
// testPlanet1.setOrbitActor(taco);

// const testMoon1 = new Actor({ x: 15, y: 15, color: 'grey', size: 5 });
// testMoon1.setOrbitActor(testPlanet1);
// testMoon1.setOrbitDistance(40);
// testMoon1.setOrbitSpeed(0.035);

// const testMoon2 = new Actor({ x: 15, y: 15, color: 'grey', size: 6 });
// testMoon2.setOrbitActor(testPlanet1);
// testMoon2.setOrbitDistance(60);
// testMoon2.setOrbitSpeed(0.025);

// actors.push(testPlanet1);
// testPlanet1.init(World, Camera);

// actors.push(testMoon1);
// testMoon1.init(World, Camera);

// actors.push(testMoon2);
// testMoon2.init(World, Camera);

const realSun = new Actor({ x: 10, y: 10, actorClass: ActorClasses.Sun1 });
actors.push(realSun);
realSun.init(World, Camera);

for (let i = 0; i < asteroidCount; i++) {
  const asteroid = new Actor({
    x: 200 + Math.random() * 300,
    y: 200 + Math.random() * 300,
    size: 5 + Math.random() * 5,
    color: 'grey',
  });

  asteroid.init(World, Camera);

  const orbitDistance = 200 + Math.random() * 300;
  const orbitSpeed = Math.random() * 0.00025;

  asteroid.setOrbitPosition(0, 0);
  asteroid.orbitDistance = orbitDistance;
  asteroid.orbitSpeed = orbitSpeed;

  actors.push(asteroid);
}

function animate() {
  World.Draw();

  requestAnimationFrame(animate);
}

World.Init();
animate();
