class Laser{
    render(){
        push();
        stroke(0, 255, 0);
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
        pop();
    }

    move(){
        this.pos.add(this.vel);
    }
   
    hits(asteroid){ //collection detection
        var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
        if (d < asteroid.radius){
            return true;
        } else {
            return false;
        }

    }
}