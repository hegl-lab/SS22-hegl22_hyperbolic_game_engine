var w = 600;
var ship;
var ship2;
var asteroids = [];
var lasers = [];
var lasers2 = [];
var eps = 0.0005;

var score = 0;
var level = 1;


let poincareDisk, geodesic;

function setup() {
    createCanvas( w, w );
    poincareDisk = new Circle(0,0,1);

    for(let i = 0; i<10; i++){
        var x = random(-1,1);
        var y = random(-1,1);
        var v1 = random(-1,1);
        var v2 = random(-1,1);
        var speed = random(-10,10);
        if (speed == 0)
            speed += 1;
        if (Math.sqrt(sq(x)+sq(y)) < 1)
            asteroids.push(new PointMovingOnGeodesic(x,y,v1,v2,0.03,poincareDisk,0.0015, [0,0,255]));
        else
            asteroids.push(new PointMovingOnGeodesic(x,0,v1,v2,0.03,poincareDisk,0.0015, [0,0,255]));
    }
   
    ship = new Ship(0.5,-0.5,0.025);
    ship2 = new Ship(-0.5,0.5,0.025);
}

function draw() {
    background( 240 );

    translate(w/2,w/2);
    scale(1, -1);
    poincareDisk.show();
    for(let i=0; i<asteroids.length; i++){
        asteroids[i].show();
        asteroids[i].move();
        //schauen ob nah genug am Rand, wenn ja aus Liste entfernen
    }

    ship.show();
    ship.turn();
    ship.move();

    ship2.show();
    ship2.turn();
    ship2.move();

    for(let i=0; i<lasers.length; i++){
        lasers[i].show();
        lasers[i].move();
        //collision detection with asteroid
        for(let j=0; j<asteroids.length; j++){
            if(collisionDetection(lasers[i].pt.x,lasers[i].pt.y,lasers[i].pt.r, asteroids[j].pt.x, asteroids[j].pt.y, asteroids[j].pt.r)){
                score+=10;
                //remove asteroids and lasers from list
                asteroids.splice(j,1);
                lasers.splice(i,1);
                console.log(score);
                break;
            }
        }
        //is laser close to boundary --> remove
        if (Math.sqrt(sq(lasers[i].pt.x)+sq(lasers[i].pt.y)) >= 1-eps)
            lasers.splice(i,1);

    }

    for(let i=0; i< lasers2.length; i++){
        lasers2[i].show();
        lasers2[i].move();
    }
    

    for(let i=0; i<asteroids.length; i++){
        var point1 = asteroids[i].pt;
        var collide = collisionDetection(point1.x,point1.y,point1.r, ship.pos.x, ship.pos.y, ship.radius*2);
        if (collide == true)
            console.log('collision')
    }
}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(-0.05);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(0.05);
    } else if (keyCode == UP_ARROW){
        ship.setBoostingState(true);
    } else if (key == ' '){ //create lasers
        lasers.push(new PointMovingOnGeodesic(ship.pos.x,ship.pos.y,ship.heading.x,ship.heading.y,0.025,poincareDisk,0.015, [0,255,0]));
    } else if (keyCode == 65){
        ship2.setRotation(-0.05);
    } else if (keyCode == 68){
        ship2.setRotation(0.05);
    } else if (keyCode == 87){
        ship2.setBoostingState(true);
    } else if (keyCode == 83){
        lasers2.push(new PointMovingOnGeodesic(ship2.pos.x,ship2.pos.y,ship2.heading.x,ship2.heading.y,0.025,poincareDisk,0.015, [0,255,0]));
    } 
}

function keyReleased(){
    ship.setRotation(0);
    ship.setBoostingState(false);
    ship2.setRotation(0);
    ship2.setBoostingState(false);
}



function hyperbolicDistance(x1,y1,x2,y2){ //p1 = (x1,y1); p2 = (x2,y2)
    var delta = 2*sq(poincareDisk.r)*((sq(x1-x2)+sq(y1-y2))/((sq(poincareDisk.r)-(sq(x1)+sq(y1)))*(sq(poincareDisk.r)-(sq(x2)+sq(y2)))))
    var distance = Math.acosh(1+delta);
    return distance;
}


function collisionDetection(x1,y1,r1,x2,y2,r2){ //p1 = (x1,y1) with radius r1; p2 = (x2,y2) with radius r2
    var distancePoints = hyperbolicDistance(x1,y1,x2,y2);
    if (distancePoints < r1+r2)
        return true;
    else  
        return false;
}