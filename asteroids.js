var w = 600;
var h = 600;
let ship;




function setup() {
    createCanvas( w, h );
    ship = new Ship(w/2,h/2);
}

function draw() {
    background( 240 );
    ship.show();
    ship.turn();
    ship.update();
}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW){
        ship.boost();
    }
}

function keyReleased(){
    ship.setRotation(0);
}



class Ship{
    constructor(x,y){
        this.pos = createVector(x,y)
        this.heading = PI/2;
        this.rotation = 0;
        this.vel = createVector(0,0);
    }

    show() {
        push();
        stroke(255,0,0);
        fill(255,0,0);
        translate(this.pos.x, this.pos.y);
        rotate(this.heading + PI/2);
        triangle(-10,10,10,10,0,-15);
        pop();
    }

    setRotation(r) {
        this.rotation = r;
    }

    turn() {
        this.heading +=this.rotation;
    }

    boost() {
        var force  = p5.Vector.fromAngle(this.heading);
        this.vel.add(force);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.mult(0.95);
    }


}
