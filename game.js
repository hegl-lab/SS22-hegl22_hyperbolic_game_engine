var w = 600;
var ship;
var asteroids = [];
var lasers = [];

var score = 0;
var level = 1;


let poincareDisk, m, geodesic;

function setup() {
    createCanvas( w, w );
    poincareDisk = new Circle(0,0,1);
    //m = new Point(0,0);

    for(let i = 0; i<1; i++){
        var x = random(-1,1);
        var y = random(-1,1);
        var v1 = random(-1,1);
        var v2 = random(-1,1);
        var speed = random(-10,10);
        if (speed == 0)
            speed += 1;
        asteroids.push(new PointMovingOnGeodesic(x,y,v1,v2,0.03,poincareDisk,speed));
        /*asteroids.push(new PointMovingOnGeodesic(0,0.2,v1,v2,0.03,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(0,0.4,v1,v2,0.03,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(0,0.6,v1,v2,0.03,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(0,0.8,v1,v2,0.03,poincareDisk,speed));
        
        asteroids.push(new PointMovingOnGeodesic(-0.2,0,v1,v2,0.03,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(-0.4,0,v1,v2,0.03,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(-0.6,0,v1,v2,0.03,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(-0.8,0,v1,v2,0.03,poincareDisk,speed));

        asteroids.push(new PointMovingOnGeodesic(0.2,0,v1,v2,0.05,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(0.4,0,v1,v2,0.05,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(0.6,0,v1,v2,0.05,poincareDisk,speed));
        asteroids.push(new PointMovingOnGeodesic(0.8,0,v1,v2,0.05,poincareDisk,speed));*/
    }
   
    ship = new Ship(-50,40,5);
    /*for (let i = 0; i < 5; i++) {       
        asteroids.push(new Asteroid());
    }*/
}

function draw() {
    background( 240 );

    translate(w/2,w/2);
    scale(1, -1);
    poincareDisk.show();
    //m.show();
    for(let i=0; i<asteroids.length; i++){
        asteroids[i].show();
        //asteroids[i].move();
    }

    /*for(var i=0; i<asteroids.length;i++){
        asteroids[i].render();
        asteroids[i].move();
    }

    for(var i=lasers.length-1; i>=0; i--){
        lasers[i].render();
        lasers[i].move();
        for(var j=asteroids.length-1; j>=0; j--){
            if(lasers[i].hits(asteroids[j])){
                var newAsteroids = asteroids[j].breakeup();
                asteroids = asteroids.concat(newAsteroids);
                asteroids.splice(j,1);
                lasers.splice(i,1);
                break;
            }
        }
    }
*/
    ship.show();
    ship.turn();
    ship.move();

    /*for(let i=0; i<asteroids.length; i++){
        var point1 = asteroids[i].pt;
        var collide = collisionDetection(point1.x,point1.y,point1.r, ship.pos.x, ship.pos.y, ship.radius);
        if (collide == true)
            console.log('collision')
    }*/
}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW){
        ship.setBoostingState(true);
    } else if (keyCode == DOWN_ARROW){
        //ship.setBoostingState(true);
    } else if (key == ' '){
        //lasers.push(new Laser(ship.pos, ship.heading));
    }
}

function keyReleased(){
    ship.setRotation(0);
    ship.setBoostingState(false);
}



function hyperbolicDistance(x1,y1,x2,y2){ //p1 = (x1,y1); p2 = (x2,y2)
    var delta = 2*sq(poincareDisk.r)*((sq(x1-x2)+sq(y1-y2))/((sq(poincareDisk.r)-(sq(x1)+sq(y1)))*(sq(poincareDisk.r)-(sq(x2)+sq(y2)))))
    var distance = Math.acosh(1+delta);
    return distance;
}


/*function collisionDetection(x1,y1,r1,x2,y2,r2){ //p1 = (x1,y1) with radius r1; p2 = (x2,y2) with radius r2
    var X=1;
    var distancePoints = hyperbolicDistance(x1,y1,x2,y2);
    var r1x = x1+r1;
    var r2x = x2+r2;

    var hyperbolicRadius1 = hyperbolicDistance(x1,y1,r1x,y1);
    var hyperbolicRadius2 = hyperbolicDistance(x1,y2,r2x,y2);
    //PROBLEM: Visual difference between radius in hyperbolic space and on canvas for drawing of circle
    //change view of circles,... to the actual size in hyperbolic space
    if (distancePoints < (hyperbolicRadius1 + hyperbolicRadius2))
        return true;
    else  
        return false;
}*/