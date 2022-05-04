var w = 600;
var h = 600;
let ship;




function setup() {
    createCanvas( w, h );
    ship = new Ship(w/2,h/2, 10);
}

function draw() {
    background( 240 );
    ship.show();
    ship.turn();
    ship.move();
    ship.edge();
}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW){
        ship.setBoostingState(true);
    }
}

function keyReleased(){
    ship.setRotation(0);
    ship.setBoostingState(false);
}



class Ship{
    constructor(x,y,r){
        this.pos = createVector(x,y)
        this.radius = r;
        this.heading = PI/2;
        this.rotation = 0;
        this.boosting = false;
        this.vel = createVector(0,0);
    }

    show() {
        push();
        stroke(255,0,0);
        fill(255,0,0);
        translate(this.pos.x, this.pos.y);
        rotate(this.heading + PI/2);
        triangle(-this.radius,this.radius,this.radius,this.radius,0,-this.radius*3/2);
        pop();
    }

    setRotation(r) {
        this.rotation = r;
    }

    turn() {
        this.heading +=this.rotation;
    }

    setBoostingState(b) {
        this.boosting = b;
    }

    boost() {
        var force  = p5.Vector.fromAngle(this.heading);
        force.mult(0.1);
        this.vel.add(force);
    }

    move() {
        if(this.boosting){
            this.boost();
        }
        this.pos.add(this.vel);
        this.vel.mult(0.97);
    }


    edge(){
        if(this.pos.x > w + this.radius) //right border
            this.pos.x = -this.radius;
        else if (this.pos.x < -this.radius) //left border
            this.pos.x = w + this.radius;
        else if (this.pos.y < -this.radius) //top border
            this.pos.y = h + this.radius;
        else if (this.pos.y > h + this.radius) //bottom border
            this.pos.y = -this.radius;
    }
}
