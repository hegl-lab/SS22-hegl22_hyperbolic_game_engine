class Ship{
    constructor(x,y,r){
        this.pos = createVector(x,y) //position of the triangle
        this.radius = r; //size of the triangle
        this.heading = createVector(1,1); //direction as a vector, needed to construct geodesic
        this.normHeading();
        this.rot = 0;
        this.invPos = this.inversePosition(); //inverse point needed to construct geodesic
        this.geodesic = this.constructGeodesic(); //geodesic based on location and direction
        this.alpha = this.calculateAlpha(); //calculate angle for position on geodesic
        this.boosting = false;
        this.vel = createVector(0,0);
    }

    show() { 
        push(); // show the calculated geodesic
        //this.geodesic.show();
        pop()
        // show the spaceship as a red triangle
        push();
        var res = constructCanvasPosRadius(this.pos.x,this.pos.y,this.radius);
        var b = res[0];
        var l = res[1] * w;

        stroke(255,0,0);
        fill(255,0,0);
        translate(b[0]*w/2,  b[1] * w/2); //pos evtl. an canvas anpassen
        rotate(Math.atan2(this.heading.y, this.heading.x) + PI/2);
        triangle(-l,l,l,l,0,-l*3/2);
        pop();;
    }


    setRotation(r) {
        this.rot = r;
    }

    turn() {
        if(this.rot != 0){ //only when key is pressed, rotation and geodesic are updated
            var theta = Math.atan2(this.heading.y, this.heading.x);
            theta += this.rot; //set new rotation and heading
            this.heading = createVector(Math.cos(theta), Math.sin(theta));
            this.normHeading();
            this.invPos = this.inversePosition(); //calculate inverse point
            this.geodesic = this.constructGeodesic(); //calculate new geodesic
            this.alpha = this.calculateAlpha(); //calculate alpha for position on geodesic
        }
    }


    setBoostingState(b) {
        this.boosting = b;
    }

    boost() { 
        if (this.geodesic.constructor.name == "LineSegment"){ //geodesic ist diameter of poincare disc
            var force  = p5.Vector.fromAngle(this.heading);
            force.mult(0.001); //TO-DO: speed needs to be changed based on position
            this.pos.add(force);
        }
        else {
            //moving along geodesic includes rotation
            //angle change of rotation is equal to angle change of position
            var lin_speed = 0.0035;
            var del_alpha = lin_speed * (1 - (sq(this.pos.x)+sq(this.pos.y)))/(2*this.geodesic.r);
            //compute +ve dir of alpha with cross prod of heading & pos vector wrt center of geodesic great circle
            var cross_prod = this.heading.x * (this.pos.y - this.geodesic.y/(w/2)) - this.heading.y * (this.pos.x - this.geodesic.x/(w/2));
            var alpha_orient = Math.sign(cross_prod); //use sign for orientation
            // bei Sprungstelle ist Geodesic noch nicht ganz richtig
            this.alpha = this.alpha - alpha_orient * del_alpha;
            var newX = this.geodesic.x/(w/2) + this.geodesic.r*Math.cos(this.alpha);
            var newY = this.geodesic.y/(w/2) + this.geodesic.r*Math.sin(this.alpha);

            var dist1 = sqrt(sq(this.pos.x)+sq(this.pos.y));
            //set new position
            this.pos = createVector(newX,newY);

            var dist2 = sqrt(sq(this.pos.x)+sq(this.pos.y));
            //calculate radius change
            /*var del_radius = 0.00000015*(sq(poincareDisk.r) - (sq(this.pos.x)+sq(this.pos.y)));
            if (dist1<dist2)
                this.radius = this.radius - del_radius;
            else
                this.radius = this.radius + del_radius;*/
            //set new heading
            this.heading = createVector(alpha_orient * (this.pos.y - this.geodesic.y/(w/2)), -alpha_orient *(this.pos.x - this.geodesic.x/(w/2)));
        }
    }

    move() { 
        //move along the calculated geodesic
        if(this.boosting){
            this.boost();
        }
    }

    inversePosition(){ //calculate inverse position 
        let x0 = this.pos.x;
        let y0 = this.pos.y;
        let circle_x = poincareDisk.x;
        let circle_y = poincareDisk.y;
        let len1 = dist(circle_x, circle_y, x0, y0);
        let len2 = 1/len1;
        let x1 = circle_x + len2*(x0-circle_x)/len1;
        let y1 = circle_y + len2*(y0-circle_y)/len1;
        return createVector(x1,y1);
    }

    constructGeodesic(){ //calculate geodesic based on position and direction
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
        return new Circle(m1*w/2, m2*w/2, radius);
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
            return Math.atan2(this.pos.y - this.geodesic.y/(w/2), this.pos.x - this.geodesic.x/(w/2)); //save angle of location on geodesic (circle)
        }
        else if (this.geodesic.constructor.name == "LineSegment"){
            return -1;
        }
    }
}
