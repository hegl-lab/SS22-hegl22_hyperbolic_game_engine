
class Geodesic {
    constructor(x, y, v1, v2, circle){
        this.pt1 = new Point(x,y,v1,v2);
        this.circle = circle;
        this.pt2 = this.circle.reflectPoint(this.pt1);
        this.m = this.pt1.createCircleDir(this.pt2);
    }

    show(){
        push();
        this.pt1.show();
        this.pt2.show();
        this.m.show();
        pop();
    }
}


class Point {
    constructor( x, y , v1, v2) {
        this.x = x;
        this.y = y;
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
        circle( this.x, this.y, 5 );
        this.dir.show();
        pop();
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
        
        let eps = 0.00001
        if (dist(m1,m2,x1,y1) - radius > eps){ //both points has to be on circle
            console.log(1);
            m1 = this.x + radius*diry;
            m2 = this.y - radius*dirx;
        }
        let c = new Circle(m1, m2, radius*2);
        return c;
    }

    createCircle(pt2){ //points has to be aligned
        let x2 = pt2.x;
        let y2 = pt2.y;
        let radius = dist(this.x,this.y,x2,y2);
        let mx = this.x + (x2-this.x)/2;
        let my = this.y + (y2-this.y)/2;
        let c = new Circle(mx,my,radius);
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
        circle(this.x,this.y,this.r);
        pop();
    }

    reflectPoint(pt0) {
        let x0 = pt0.x;
        let y0 = pt0.y;
        let len1 = dist(this.x, this.y, x0, y0);
        let len2 = this.r/len1;
        let x1 = this.x + len2*(x0-this.x);
        let y1 = this.y + len2*(y0-this.y);
        let pt = new Point(x1,y1);
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


