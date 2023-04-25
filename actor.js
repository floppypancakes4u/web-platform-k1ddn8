const amplitude = 0.425; // (1.0 - 0.15) / 2
const frequency = 0.1; // increment

export class Actor {
  constructor({
    x = 0,
    y = 0,
    dir = 0,
    size = 30,
    actorClass = null,
    color = 'grey',
  }) {
    this.x = x;
    this.y = y;
    this.dir = 0;
    this.size = size;
    this.color = color;
    this.orbitActor = null;
    this.orbitPosition = null;
    this.orbitSpeed = 0.005;
    this.orbitAngle = 100 * Math.random();
    this.orbitDistance = 100;
    this.camera = null;
    this.selected = false;
    this.showingData = false;
    this.targetingState = false;
    this.targetStateOpacity = 0;
    this.targetStateInterval = null;
    this.time = 0;
    this.world = null;
    this.actorClass = actorClass;
    this.actorSprite = null;
    this.useColorForActor = true;

    if (this.actorClass != null) {
      let img = new Image();
      img.src = actorClass.src;
      img.onload = function (e) {
        this.actorSprite = actorClass.src;
      };
      console.log(img);
      this.useColorForActor = false;
    }
  }

  setSelected(state) {
    this.selected = state;
  }

  setTargetState(state) {
    this.targetingState = state;
    console.log('Target state set to ', state);
  }

  setOrbitActor(actor) {
    this.orbitActor = actor;
  }

  setOrbitPosition(x, y) {
    this.orbitPosition = { x, y };
  }

  setOrbitSpeed(speed) {
    this.orbitSpeed = speed;
  }

  setOrbitAngle(angle) {
    this.orbitAngle = angle;
  }

  setOrbitDistance(distance) {
    this.orbitDistance = distance;
  }

  init(world, camera) {
    this.world = world;
    this.camera = camera;
  }

  tick(world) {
    // Update Pulse time if active
    if (this.selected || this.targetingState) {
      this.targetStateOpacity = Math.sin(this.time) * amplitude + 0.575; // 0.575 = (1.0 + 0.15) / 2
      this.time += frequency;
    }
  }

  draw(world) {
    // This has to be drawn first, otherwise the actor itself won't be detected by mouseover events
    this.drawHoverReticle();

    if (this.orbitActor) {
      // If orbiting an actor
      this.orbitAngle += this.orbitSpeed;
      const orbitX =
        this.orbitActor.x + this.orbitDistance * Math.cos(this.orbitAngle);
      const orbitY =
        this.orbitActor.y + this.orbitDistance * Math.sin(this.orbitAngle);
      this.x = orbitX;
      this.y = orbitY;
    } else if (this.orbitPosition) {
      // If orbiting a position
      this.orbitAngle += this.orbitSpeed;
      const orbitX =
        this.orbitPosition.x + this.orbitDistance * Math.cos(this.orbitAngle);
      const orbitY =
        this.orbitPosition.y + this.orbitDistance * Math.sin(this.orbitAngle);
      this.x = orbitX;
      this.y = orbitY;
    }

    const canvasPos = this.getcanvasPosition();

    if (this.useColorForActor) {
      this.world.ctx.beginPath();
      this.world.ctx.arc(canvasPos.x, canvasPos.y, this.size, 0, 2 * Math.PI);
      this.world.ctx.fillStyle = this.color;
      this.world.ctx.fill();
    } else {
      this.world.ctx.drawImage(this.actorSprite, this.size, this.size);
    }

    if (this.selected) this.showEntityDetails();
  }

  drawHoverReticle() {
    if (this.targetingState == false && this.selected == false) return;

    const canvasPos = this.getcanvasPosition();

    this.world.ctx.strokeStyle = `rgba(25, 255, 255, ${this.targetStateOpacity})`;
    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x - this.size * 1.75,
      canvasPos.y - this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x - this.size * 0.75,
      canvasPos.y - this.size * 1.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x - this.size * 1.75,
      canvasPos.y - this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x - this.size * 1.75,
      canvasPos.y - this.size * 0.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x + this.size * 1.75,
      canvasPos.y - this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x + this.size * 0.75,
      canvasPos.y - this.size * 1.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x + this.size * 1.75,
      canvasPos.y - this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x + this.size * 1.75,
      canvasPos.y - this.size * 0.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x - this.size * 1.75,
      canvasPos.y + this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x - this.size * 0.75,
      canvasPos.y + this.size * 1.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x - this.size * 1.75,
      canvasPos.y + this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x - this.size * 1.75,
      canvasPos.y + this.size * 0.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x + this.size * 1.75,
      canvasPos.y + this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x + this.size * 0.75,
      canvasPos.y + this.size * 1.75
    );
    this.world.ctx.stroke();

    this.world.ctx.beginPath();
    this.world.ctx.moveTo(
      canvasPos.x + this.size * 1.75,
      canvasPos.y + this.size * 1.75
    );
    this.world.ctx.lineTo(
      canvasPos.x + this.size * 1.75,
      canvasPos.y + this.size * 0.75
    );
    this.world.ctx.stroke();
  }

  showEntityDetails() {
    const canvasPos = this.getcanvasPosition();

    this.world.ctx.fillStyle = 'white';
    this.world.ctx.fillText(
      `X: ${this.x.toFixed(2)} Y: ${this.y.toFixed(2)}`,
      canvasPos.x - this.size * 1.75,
      canvasPos.y - this.size * 1.75
    );
  }

  getcanvasPosition() {
    return { x: this.x - this.camera.X, y: this.y - this.camera.Y };
  }
}
