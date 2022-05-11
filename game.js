var w = 800;
var h = 550;
var ship;
var asteroids = [];
var lasers = [];

var score = 0;
var level = 1;




function setup() {
    createCanvas( w, h );
    ship = new Ship(w/2,h/2, 10);
    for (let i = 0; i < 5; i++) {       
        asteroids.push(new Asteroid());
    }
}

function draw() {
    background( 240 );
    
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
    ship.edge();
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
