//geodesic berechnen aus den x & y coordinate und heading


class Ship{
    constructor(x,y,r){
        this.pos = createVector(x,y)
        this.radius = r;
        this.heading = createVector(1,1);
        this.normHeading();
        this.rotation = Math.acos(this.heading.x/sqrt(sq(this.heading.x)+sq(this.heading.y)));
        this.rot = 0;
        this.boosting = false;
        this.vel = createVector(0,0);
        this.invPos = this.inversePosition();
        this.geodesic = this.constructGeodesic();
    }

    show() { // show the spaceship as a red triangle
        push();
        stroke(255,0,0);
        fill(255,0,0);
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation + PI/2);
        triangle(-this.radius,this.radius,this.radius,this.radius,0,-this.radius*3/2);
        pop();
        push(); // show the calculated geodesic
        this.geodesic.show();
        pop();
    }


    setRotation(r) {
        this.rot = r;
    }

    turn() {
        this.rotation +=this.rot;//hier geodesic neu berechnen
        this.heading = createVector(1,Math.tan(this.rotation));
        this.normHeading();
        this.geodesic = this.constructGeodesic();
    }


    // MOVEMENT HAS TO BE CHANGED!!! --> during movement, rotation is also needed
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
    ///

    inversePosition(){
        let x0 = this.pos.x;
        let y0 = this.pos.y;
        let circle_x = poincareDisk.x;
        let circle_y = poincareDisk.y;
        let len1 = dist(circle_x, circle_y, x0, y0);
        let len2 = sq(poincareDisk.r)/len1;
        let x1 = circle_x + len2*(x0-circle_x)/len1;
        let y1 = circle_y + len2*(y0-circle_y)/len1;
        return createVector(x1,y1);
    }

    constructGeodesic(){
        let dirx = this.heading.x;
        let diry = this.heading.y;
        if(this.pos.x == poincareDisk.x && this.pos.y == poincareDisk.y)   // ship is at the midpoint --> no existing inverse point 
            return new LineSegment(this.pos.x - 300*dirx, this.pos.y - 300*diry, this.pos.x + 300*dirx, this.pos.y + 300*diry);
        let x1 = this.invPos.x;
        let y1 = this.invPos.y;
        let radius = abs(((x1-this.pos.x)*(x1-this.pos.x) + (y1-this.pos.y)*(y1-this.pos.y))/(2*(diry*(this.pos.x-x1)+dirx*(y1-this.pos.y))));
        if(radius  == Infinity){ // point is on diameter geodesic
            return new LineSegment(this.pos.x-300*dirx,this.pos.y-300*diry, (this.pos.x+300*dirx), (this.pos.y + 300*diry));
        }
        
        let m1 = this.pos.x - radius*diry;
        let m2 = this.pos.y + radius*dirx;
        let eps = 0.00000001
        if (dist(m1,m2,x1,y1) - radius > eps){ // both points has to be on circle
            m1 = this.pos.x + radius*diry;
            m2 = this.pos.y - radius*dirx;
        }
        return new Circle(m1, m2, radius);
    }

    normHeading(){
        let norm = Math.sqrt(sq(this.heading.x) + sq(this.heading.y))
        if (norm != 0){
            this.heading.x = this.heading.x/norm;
            this.heading.y = this.heading.y/norm;
        } 
    }
}
