
class Geodesic {
    constructor(pt1, circle){
        this.pt1 = pt1;
        this.circle = circle;
        this.pt2 = this.circle.reflectPoint(this.pt1);
        if(this.pt1.x == this.circle.x && this.pt1.y == this.circle.y){ //pt1 is midpoint of circle
            this.m = new LineSegment(this.pt1.x-300*this.pt1.dir.x,this.pt1.y-300*this.pt1.dir.y, (this.pt1.x+300*this.pt1.dir.x), (this.pt1.y + 300*this.pt1.dir.y))
 
        }
        else {
            this.m = this.pt1.createCircleDir(this.pt2);
        }
    }

    show(){
        push();
        this.m.show();
        pop();
    }
}


class PointMovingOnGeodesic {
    constructor( x, y , v1, v2, r, circle, speed){
        this.pt = new Point(x,y,v1,v2,r);
        this.circle = circle;
        this.geodesic = new Geodesic(this.pt, circle); //radius, x,y coordinate of midpoint
        this.alpha = Math.acos((x-this.geodesic.m.x)/this.geodesic.m.r);
        this.speed = speed;
        
        console.log(this.geodesic.m.r);
    }

    show() {
        
        push();
        if (Math.sqrt(this.pt.x*this.pt.x + this.pt.y*this.pt.y) < this.circle.r) //only points in the poincare disc are shown
            this.pt.show();
        //this.geodesic.show();
        pop();
    }

    move() {
        var del_alpha = ((sq(this.circle.r) - (sq(this.pt.x)+sq(this.pt.y)))*0.000015)/(2*this.geodesic.m.r);
        this.alpha = this.alpha + del_alpha;
        var newX = this.geodesic.m.r*Math.cos(this.alpha) + this.geodesic.m.x;
        var newY = this.geodesic.m.r*Math.sin(this.alpha) + this.geodesic.m.y;
        var newV1 = 0;
        var newV2 = 0;
        var radius = this.pt.r * Math.sqrt(sq(Math.cos(this.alpha))+sq(Math.sin(this.alpha)))*0.999;
        //this.pt = new Point(newX, newY, newV1, newV2, radius);
        this.pt = new Point(newX, newY, newV1, newV2, this.pt.r);
    }
}



class PointWithMovingGeodesic {
    constructor( x, y , v1, v2, r, circle){
        this.pt = new Point(x,y,v1,v2,r);
        this.circle = circle;
        this.geodesic = new Geodesic(this.pt, circle);
        this.boosting = false;
        this.vel = createVector(0,0);
    }

    show() {
        push();
        this.pt.show();
        this.geodesic.show();
        pop();
    }

    setBoostingState(b) {
        this.boosting = b;
    }

    boost(x,y) {
        var force  = createVector(x,y);
        //force.mult(0.1);
        this.vel.add(force);
    }

    move() {
        var newX = this.pt.x + this.vel.x;
        var newY = this.pt.y + this.vel.y;
        this.pt = new Point(newX, newY, this.pt.v1, this.pt.v2, this.pt.r);
        this.geodesic = new Geodesic(this.pt, this.circle);
        this.vel.mult(0.7);
    }

}


class Point {
    constructor( x, y, v1, v2, r) {
        this.x = x;
        this.y = y;
        this.v1 = v1;
        this.v2 = v2;
        this.r = r;
        if(!v1 && !v2){ //no normalisation, when no direction given
            this.dir = new Direction(this.x,this.y,0,0);
        }
        else {
            this.dir = new Direction(this.x,this.y, v1,v2);
            this.dir.norm();
        }
    }
    
    show() {
        push();
        stroke( 0, 0, 255 );
        fill( 0, 0, 255 );
        //var radius = this.calculateRadius();
        circle(this.x, this.y, this.r);
        this.dir.show();
        pop();
    }

    calculateRadius(){
        var newX = (this.x-w/2)/(w/2);
        var newY = (this.y-w/2)/(w/2);
        var norm = Math.sqrt(sq(newX) + sq(newY));
        var pm = ((1+norm)*Math.exp(this.r) - (1-norm))/((1+norm)*Math.exp(this.r) + (1-norm));
        var qm = ((1+norm) - (1-norm)*Math.exp(this.r))/((1+norm) + (1-norm)*Math.exp(this.r));
        var phi = arg([this.x,this.y]);
        return Math.sqrt(sq((pm-qm)*(phi)) + sq((pm-qm)*(phi)));
    }

    createCircleDir(pt1){ //create circle from two given points and direction
        let dirx = this.dir.x;
        let diry = this.dir.y;
        let x1 = pt1.x;
        let y1 = pt1.y;
        let radius = abs(((x1-this.x)*(x1-this.x) + (y1-this.y)*(y1-this.y))/(2*(diry*(this.x-x1)+dirx*(y1-this.y))));
        if(radius  == Infinity){
            let line = new LineSegment(this.x-300*dirx,this.y-300*diry, (this.x+300*dirx), (this.y + 300*diry));
            return line;
        }
        
        let m1 = this.x - radius*diry;
        let m2 = this.y + radius*dirx;
        
        let eps = 0.00000001
        if (dist(m1,m2,x1,y1) - radius > eps){ //both points has to be on circle
            m1 = this.x + radius*diry;
            m2 = this.y - radius*dirx;
        }
        let c = new Circle(m1, m2, radius);
        return c;
    }
}

function arg(a) {
    let mult = 0;
    if(a[0] <0) {
        mult = 1;
    }
    return atan(a[1]/a[0]) + mult * PI;
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
        circle(this.x,this.y,this.r*2);
        pop();
    }

    reflectPoint(pt0) {
        let x0 = pt0.x;
        let y0 = pt0.y;
        let len1 = dist(this.x, this.y, x0, y0);
        let len2 = (this.r*this.r)/len1;
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

    norm(){
        let norm = sqrt(this.x*this.x + this.y*this.y);
        if (norm != 0){
            this.x = this.x/norm;
            this.y = this.y/norm;
        } 
    }
}


