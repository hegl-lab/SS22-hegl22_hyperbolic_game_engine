var w = 800;
var h = 550;
var ship;
var asteroids = [];
var lasers = [];

var score = 0;
var level = 1;




function setup() {
    createCanvas( w, h );
    /*ship = new Ship(w/2,h/2, 10);
    for (let i = 0; i < 5; i++) {       
        asteroids.push(new Asteroid());
    }*/
}

function draw() {
    background( 240 );

    translate(10,h/2);
    drawTransformation();

    /*
    for(var i=0; i<asteroids.length;i++){
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

function drawTransformation()
{   
    var C = createVector(200,0);
    var R = 100;
    var pos1 = createVector(0,10);
    var pos2 = createVector(0,30);
    var pos3 = createVector(0,50);
    var pos4 = createVector(0,70);
    var pos5 = createVector(0,90);
    var pos6 = createVector(0,110);
    var pos7 = createVector(0,130);
    var pos8 = createVector(0,150);
    stroke(0, 255, 0);
    strokeWeight(4);

    point(pos1.x, pos1.y);
    point(pos2.x, pos2.y);
    point(pos3.x, pos3.y);
    point(pos4.x, pos4.y);
    point(pos5.x, pos5.y);
    point(pos6.x, pos6.y);
    point(pos7.x, pos7.y);
    point(pos8.x, pos8.y);

    point(C.x,C.y);
    //circle(C.x, C.y, R);

    var newpos1 = moebtransform(pos1,C,R);
    var newpos2 = moebtransform(pos2,C,R);
    var newpos3 = moebtransform(pos3,C,R);
    var newpos4 = moebtransform(pos4,C,R);
    var newpos5 = moebtransform(pos5,C,R);
    var newpos6 = moebtransform(pos6,C,R);
    var newpos7 = moebtransform(pos7,C,R);
    var newpos8 = moebtransform(pos8,C,R);
    point(newpos1.x, newpos1.y);
    point(newpos2.x, newpos2.y);
    point(newpos3.x, newpos3.y);
    point(newpos4.x, newpos4.y);
    point(newpos5.x, newpos5.y);
    point(newpos6.x, newpos6.y);
    point(newpos7.x, newpos7.y);
    point(newpos8.x, newpos8.y);
}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW){
        ship.setBoostingState(true);
    } else if (key == ' '){
        lasers.push(new Laser(ship.pos, ship.heading));
    }
}

function keyReleased(){
    ship.setRotation(0);
    ship.setBoostingState(false);
}
