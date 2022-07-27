//size of canvas
var w = 600; 

//variables for the objects
var poincareDisk;
var ship;
var asteroids = [];
var lasers = [];

var eps = 0.0005;

//scoring and level
var score = 0;
var level = 1;
var tag;


function setup() {
    createCanvas(w, w);

    //set the poincare disk as a unit circle
    poincareDisk = new Circle(0,0,1);

    //create randomly set asteroids
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
   
    //create ship, that can be steered
    ship = new Ship(0.5,-0.5,0.025);
}

function draw() {
    background(240);
    translate(w/2,w/2);
    scale(1, -1);

    //show poincare disc
    poincareDisk.show();

    //show and move asteroids along geodesics
    for(let i=0; i<asteroids.length; i++){
        asteroids[i].show();
        asteroids[i].move();
        //asterois to close to boundary --> remove from list
        if(Math.sqrt(sq(asteroids[i].pt.x)+sq(asteroids[i].pt.y)) >= 1-eps){
            asteroids.splice(i,1);
            break;
        }
    }

    //show and transform position of the ship
    ship.show();
    ship.turn();
    ship.move();

    //show and move lasers along geodesics
    for(let i=0; i<lasers.length; i++){
        lasers[i].show();
        lasers[i].move();
        //laser to close to boundary --> remove from list
        if (Math.sqrt(sq(lasers[i].pt.x)+sq(lasers[i].pt.y)) >= 1-eps){
            lasers.splice(i,1);
            break;
        }
        //collision detection with asteroid
        for(let j=0; j<asteroids.length; j++){
            if(collisionDetection(lasers[i].pt.x,lasers[i].pt.y,lasers[i].pt.r, asteroids[j].pt.x, asteroids[j].pt.y, asteroids[j].pt.r)){
                score+=10;
                //remove asteroids and lasers from list
                asteroids.splice(j,1);
                lasers.splice(i,1); 
                break;
            }
        }

    }
    
    //collision detection with ship and asteroids
    for(let i=0; i<asteroids.length; i++){
        var point1 = asteroids[i].pt;
        var collide = collisionDetection(point1.x,point1.y,point1.r, ship.pos.x, ship.pos.y, ship.radius*2);
        if (collide == true)
            console.log('collision')
    }

    tag = createP("Score: "+ score); // refresh muss noch eingefügt werden
    tag.position(20,20);
}

//steering of the ship and shooting lasers
function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(-0.05);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(0.05);
    } else if (keyCode == UP_ARROW){
        ship.setBoostingState(true);
    } else if (key == ' '){ //create lasers
        lasers.push(new PointMovingOnGeodesic(ship.pos.x,ship.pos.y,ship.heading.x,ship.heading.y,0.025,poincareDisk,0.015, [255,125,0]));
    } 
}

function keyReleased(){
    ship.setRotation(0);
    ship.setBoostingState(false);
}


//collision detection using the hyperbolic distance and the outer circle of the objects
function collisionDetection(x1,y1,r1,x2,y2,r2){ //p1 = (x1,y1) with radius r1; p2 = (x2,y2) with radius r2
    var distancePoints = hyperbolicDistance(x1,y1,x2,y2);
    if (distancePoints < r1+r2)
        return true;
    else  
        return false;
}