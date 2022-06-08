var w = 1000;
var h = 1000;
var ship;
var asteroids = [];
var lasers = [];

var score = 0;
var level = 1;


let circle0, m, geodesic, pointM;

function setup() {
    createCanvas( w, h );
    circle0 = new Circle(0,0,250);
    m = new Point(0,0);
    pointM = new PointWithMovingGeodesic(0,0,10,-10,5,circle0);

    for(let i = 0; i<20; i++){
        var x = random(-150,150);
        var y = random(-150,150);
        var v1 = random(-10,10);
        var v2 = random(-10,10);
        var speed = random(-10,10);
        if (speed == 0)
            speed += 1;
        asteroids.push(new PointMovingOnGeodesic(x,y,v1,v2,5,circle0,speed));
    }
   
    /*ship = new Ship(w/2,h/2, 10);
    for (let i = 0; i < 5; i++) {       
        asteroids.push(new Asteroid());
    }*/
}

function draw() {
    background( 240 );

    translate(w/2,h/2);

    circle0.show();
    m.show();
    pointM.show();
    pointM.move();
    for(let i=0; i<20; i++){
        asteroids[i].show();
        asteroids[i].move();
    }

    /*for(var i=0; i<asteroids.length;i++){
        asteroids[i].render();
        asteroids[i].move();
        asteroids[i].edge();
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

    ship.show();
    ship.turn();
    ship.move();
    ship.edge();*/

}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        pointM.setBoostingState(true);
        pointM.boost(1,0);
        //ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW){
        pointM.setBoostingState(true);
        pointM.boost(-1,0);
        //ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW){
        pointM.setBoostingState(true);
        pointM.boost(0,-1);
        //ship.setBoostingState(true);
    } else if (keyCode == DOWN_ARROW){
        pointM.setBoostingState(true);
        pointM.boost(0,1);
        //ship.setBoostingState(true);
    } else if (key == ' '){
        //lasers.push(new Laser(ship.pos, ship.heading));
    }
}

function keyReleased(){
    //ship.setRotation(0);
    //ship.setBoostingState(false);
    pointM.setBoostingState(false);
}
