var w = 800;
var h = 550;
var ship;
var asteroids = [];




function setup() {
    createCanvas( w, h );
    ship = new Ship(w/2,h/2, 10);
    for (let i = 0; i < 5; i++) {       
        asteroids.push(new Asteroid());
    }
}

function draw() {
    background( 240 );
    ship.show();
    ship.turn();
    ship.move();
    ship.edge();

    for(var i=0; i<asteroids.length;i++){
        asteroids[i].render()
    }
}


function keyPressed(){
    if(keyCode == RIGHT_ARROW){
        ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW){
        ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW){
        ship.setBoostingState(true);
    }
}

function keyReleased(){
    ship.setRotation(0);
    ship.setBoostingState(false);
}
