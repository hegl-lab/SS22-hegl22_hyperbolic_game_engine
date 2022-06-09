//geodesic berechnen aus den x & y coordinate und heading


class Ship{
    constructor(x,y,r){
        this.pos = createVector(x,y)
        this.radius = r;
        this.heading = PI/2; //richtung evtl. als vector, wie in points
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
        this.heading +=this.rotation;//hier geodesic neu berechnen
    }

    setBoostingState(b) {
        this.boosting = b;
    }

    boost() {
        var force  = p5.Vector.fromAngle(this.heading);
        force.mult(0.1);
        this.vel.add(force);
    }

    move() { //along the calculated geodesic
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
