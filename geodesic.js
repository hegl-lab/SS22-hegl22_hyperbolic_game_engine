//construct geodesic from a given point and a circle defining the poincare disc
class Geodesic {
    constructor(pt1, circle){
        this.pt1 = pt1; //given point
        this.circle = circle; //poincare disc, circle to reflect point pt1
        this.pt2 = this.circle.reflectPoint(this.pt1); //reflected point of pt1

        if(this.pt1.x == this.circle.x && this.pt1.y == this.circle.y){ //pt1 is midpoint of circle
            //geodesic is diameter
            this.m = new LineSegment(this.pt1.x-300*this.pt1.dir.x,this.pt1.y-300*this.pt1.dir.y, (this.pt1.x+300*this.pt1.dir.x), (this.pt1.y + 300*this.pt1.dir.y))
        }
        else {
            //geodesic is circular arc rectangular to the unit boundary
            this.m = this.pt1.createCircleDir(this.pt2);
        }
    }

    show(){
        push();
        this.m.show();
        pop();
    }
}

//e.g. lasers
class PointMovingOnGeodesic {
    constructor( x, y , v1, v2, r, circle, speed, color){
        this.pt = new Point(x,y,v1,v2,r,color); //point with position on canvas, direction, radius and color
        this.circle = circle;//poincare disc
        this.geodesic = new Geodesic(this.pt, circle); //radius, x,y coordinate of midpoint of the geodesic
        this.alpha = Math.atan2(y-this.geodesic.m.y/(w/2), x-this.geodesic.m.x/(w/2)); //angle of point on geodesic
        this.speed = speed;
    }

    show() {
        push();
        //only points in the poincare disc are shown
        if (Math.sqrt(this.pt.x*this.pt.x + this.pt.y*this.pt.y) < 1){ //only points in the poincare disc are shown
            this.pt.show();
        }  
        //this.geodesic.show();
        pop();
    }

    //move object along given geodesic
    move() { 
        //calculate angle change
        var del_alpha = this.speed * (1 - (sq(this.pt.x)+sq(this.pt.y)))/(2*this.geodesic.m.r);
        //calculate sign of change -> determine in which direction to move
        var cross_prod = this.pt.v1 * (this.pt.y - this.geodesic.m.y/(w/2)) - this.pt.v2 * (this.pt.x - this.geodesic.m.x/(w/2));
        var alpha_orient = Math.sign(cross_prod);
        //calculate new angle
        this.alpha = this.alpha - alpha_orient * del_alpha;

        //calculate new position
        var newX = this.geodesic.m.x/(w/2) + this.geodesic.m.r * Math.cos(this.alpha);
        var newY = this.geodesic.m.y/(w/2) + this.geodesic.m.r * Math.sin(this.alpha);

        //calculate new direction to move
        this.pt.v1 = alpha_orient * (newY - this.geodesic.m.y/(w/2));
        this.pt.v2 = -alpha_orient * (newX - this.geodesic.m.x/(w/2));

        //set new position of object
        this.pt.x = newX;
        this.pt.y = newY;
    }
}


class Point {
    constructor( x, y, v1, v2, r, color) {
        this.x = x;
        this.y = y;
        this.v1 = v1;
        this.v2 = v2;
        this.r = r;
        this.color = color;
        if(!v1 && !v2){ //no normalisation, when no direction given
            this.dir = new Direction(this.x,this.y,0,0);
        }
        else { //normalise direction
            this.dir = new Direction(this.x,this.y, v1,v2);
            this.dir.norm();
        }
    }
    
    show() {
        //calculate right position(b) and radius(l) of the point
        var res = constructCanvasPosRadius(this.x,this.y,this.r);
        var b = res[0];
        var l = res[1];
        push();
        stroke( this.color[0], this.color[1], this.color[2] );
        fill( this.color[0], this.color[1], this.color[2] );
        circle(b[0] * w/2, b[1] * w/2, w * l); //multiplied with w/2 to have right position on canvas
        pop();
    }

    //create circle (geodesic) from two given points and direction 
    createCircleDir(pt1){ 
        let dirx = this.dir.x;
        let diry = this.dir.y;
        let x1 = pt1.x;
        let y1 = pt1.y;
        let radius = abs(((x1-this.x)*(x1-this.x) + (y1-this.y)*(y1-this.y))/(2*(diry*(this.x-x1)+dirx*(y1-this.y))));
        if(radius  == Infinity){
            //geodesic is the diameter
            let line = new LineSegment(this.x-300*dirx,this.y-300*diry, (this.x+300*dirx), (this.y + 300*diry));
            return line;
        }
        
        //calculate midpoints of geodesic circle
        let m1 = this.x - radius*diry;
        let m2 = this.y + radius*dirx;
        
        let eps = 0.00000001
        if (dist(m1,m2,x1,y1) - radius > eps){ //both points has to be on circle
            m1 = this.x + radius*diry;
            m2 = this.y - radius*dirx;
        }

        //create circle as geodesic
        let c = new Circle(m1*w/2, m2*w/2, radius); //multiplied with w/2 to have right position in canvas
        return c;
    }
}


class Circle {
    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    show() {
        push();
        stroke(0);
        noFill();
        circle(this.x,this.y,this.r*w);
        pop();
    }

    //reflect a point on the circle
    reflectPoint(pt0) {
        let x0 = pt0.x;
        let y0 = pt0.y;
        let len1 = dist(this.x, this.y, x0, y0);
        let len2 = 1/len1;
        let x1 = this.x + len2*(x0-this.x)/len1;
        let y1 = this.y + len2*(y0-this.y)/len1;
        let pt = new Point(x1,y1, pt0.r);
        return pt;
    }
}


class LineSegment {
    constructor( x1, y1, x2, y2 ) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    
    show() {
        push();
        stroke(0);
        line( this.x1, this.y1, this.x2, this.y2 );
        pop();    
    }
}

class Direction{
    constructor(ptx, pty, x, y){
        this.ptx = ptx;
        this.pty = pty;
        this.x = x;
        this.y = y;
    }

    show(){
        push();
        stroke( 255,0,0 );
        line(this.ptx,this.pty,(this.ptx+40*this.x),(this.pty+40*this.y));
        pop();
    }

    //normalise direction vector
    norm(){
        let norm = sqrt(this.x*this.x + this.y*this.y);
        if (norm != 0){
            this.x = this.x/norm;
            this.y = this.y/norm;
        } 
    }
}


