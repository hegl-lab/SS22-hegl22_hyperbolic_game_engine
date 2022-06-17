class Ship{
    constructor(x,y,r){
        this.pos = createVector(x,y) //position of the triangle
        this.radius = r; //size of the triangle
        this.heading = createVector(1,1); //direction as a vector
        this.normHeading();
        this.rotation = Math.acos(this.heading.x/sqrt(sq(this.heading.x)+sq(this.heading.y))); //direction as an angle
        this.rot = 0;
        this.invPos = this.inversePosition(); //inverse point needed to construct geodesic
        this.geodesic = this.constructGeodesic(); //geodesic based on location and direction
        this.alpha = this.calculateAlpha();
        this.boosting = false;
        this.vel = createVector(0,0);
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
        if(this.rot != 0){
            this.rotation +=this.rot; //set new rotation and heading
            if(this.rotation > PI)
                this.rotation -= 2*PI;
            else if(this.rotation < -PI)
                this.rotation += 2*PI;
            this.heading = createVector(1,Math.tan(this.rotation));
            this.normHeading();
            this.invPos = this.inversePosition();
            this.geodesic = this.constructGeodesic(); //calculate new geodesic
            this.alpha = this.calculateAlpha(); //calculate alpha for position on geodesic
        }
    }


    setBoostingState(b) {
        this.boosting = b;
    }

    boost() { 
        //moving along geodesic includes rotation
        //angle change of rotation is equal to angle change of position
        if (this.geodesic.constructor.name == "LineSegment"){
            var force  = p5.Vector.fromAngle(this.heading);
            force.mult(0.001);
            this.pos.add(force);
        }
        else {
            var del_alpha = ((sq(poincareDisk.r) - (sq(this.pos.x)+sq(this.pos.y)))*0.000015)/(2*this.geodesic.r);
            // BEWEGUNG IN DIE RICHTIGE RICHTUNG FUNKTIONIERT NOCH NICHT
            // ROTATION ZUM TEIL NICHT RICHTIG
            // bei Sprungstelle ist Geodesic noch nicht ganz richtig
            console.log(this.geodesic.r);
            this.alpha = this.alpha - del_alpha; 
            this.rotation += del_alpha;
            var newX1 = this.geodesic.x + this.geodesic.r*Math.cos(this.alpha);
            var newX2 = this.geodesic.x - this.geodesic.r*Math.cos(this.alpha);
            var newY1 = this.geodesic.y + this.geodesic.r*Math.sin(this.alpha);
            var newY2 = this.geodesic.y - this.geodesic.r*Math.sin(this.alpha);
            var newX,newY;
            if (abs(this.pos.x - newX1) < abs(this.pos.x - newX2))
                newX = newX1;
            else
                newX = newX2;

            if(abs(this.pos.y - newY1) < abs(this.pos.y - newY2))
                newY = newY1;
            else
                newY = newY2;
            //var radius = this.pt.r * Math.sqrt(sq(Math.cos(this.alpha))+sq(Math.sin(this.alpha)))*0.999;
            this.pos = createVector(newX,newY);
            this.heading = createVector(1,Math.tan(this.rotation));
        }
    }

    move() { 
        //along the calculated geodesic
        if(this.boosting){
            this.boost();
        }
        
    }

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

    calculateAlpha(){
        if (this.geodesic.constructor.name == "Circle"){
            return Math.acos((this.pos.x-this.geodesic.x)/this.geodesic.r); //save angle of location on geodesic (circle)
        }
        else if (this.geodesic.constructor.name == "LineSegment"){
            return -1;
        }
    }
}
