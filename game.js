var w = 1000;
var h = 1000;
var ship;
var asteroids = [];
var lasers = [];

var score = 0;
var level = 1;


let circle0, m, point1, geodesic, pointM;

function setup() {
    createCanvas( w, h );
    circle0 = new Circle(0,0,250);
    m = new Point(0,0);
    pointM = new PointWithMovingGeodesic(10,-100,10,4,circle0);
    //point1 = new Point(10,-100,10,4);
    //geodesic = new Geodesic(point1, circle0); //für Mittelpunkt von Kreis funktioniert es noch nicht
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
    //point1.show();
    //geodesic.show();
    //point1.move(x,y);


    
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
