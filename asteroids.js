class Asteroid{
    constructor(pos, radius){
        if(pos){
            this.pos = pos.copy();
        } else{
            this.pos = createVector(random(w),random(h));
        }
        if(radius){
            this.radius = radius*0.5;
        } else {
            this.radius = random(15,70);
        }
        this.numPoints = floor(random(5,15));
        this.offset = [];
        for (var i=0; i<this.numPoints; i++){
            this.offset.push(random(-this.radius/2,this.radius/2));
        }
        this.vel = p5.Vector.random2D();
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
        this.pos.add(this.vel);
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

    breakeup(){
        var newAsteroids = [];
        newAsteroids[0] = new Asteroid(this.pos, this.radius);
        newAsteroids[1] = new Asteroid(this.pos, this.radius);
        return newAsteroids;
    }
}