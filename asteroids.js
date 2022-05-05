class Asteroid{
    constructor(){
        this.pos = createVector(random(w),random(h));
        this.radius = random(15,70);
        this.numPoints = floor(random(5,15));
        this.offset = [];
        for (var i=0; i<this.numPoints; i++){
            this.offset.push(random(-15,15));
        }
    }

    render(){
        push();
        translate(this.pos.x, this.pos.y);
        noFill();
        beginShape();
        for (var i=0; i<this.numPoints;i++){
            var angle = map(i,0,this.numPoints,0,TWO_PI);
            var x = (this.radius+this.offset[i])*cos(angle);
            var y = (this.radius+this.offset[i])*sin(angle);
            vertex(x,y);
        }
        endShape(CLOSE);
        pop();
    }

    move(){
        
    }
}