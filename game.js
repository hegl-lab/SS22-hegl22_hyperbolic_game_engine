var w = 600;
var ship;
var ship2;
var lasers = [];
var lasers2 = [];
var eps = 0.0005;

var gameover = 0;
var tag;


let poincareDisk, geodesic;

function setup() {
    createCanvas( w, w );
    poincareDisk = new Circle(0,0,1);
   
    ship = new Ship(0.5,-0.5,0.025,[255,0,0]);
    ship2 = new Ship(-0.5,0.5,0.025,[0,0,255]);
}

function draw() {
    background( 240 );

    translate(w/2,w/2);
    scale(1, -1);
    poincareDisk.show();

    if (gameover == 0){ //not game over
        ship.show();
        ship.turn();
        ship.move();

        ship2.show();
        ship2.turn();
        ship2.move();

        for(let i=0; i<lasers.length; i++){
            lasers[i].show();
            lasers[i].move();
            //laser to close to boundary --> remove
            if (Math.sqrt(sq(lasers[i].pt.x)+sq(lasers[i].pt.y)) >= 1-eps){
                lasers.splice(i,1);
                break;
            }

            if(collisionDetection(lasers[i].pt.x,lasers[i].pt.y,lasers[i].pt.r, ship2.pos.x, ship2.pos.y, ship2.radius*2)){
                //GAME OVER
                gameover = 1;
                break;
            }

            //collision detection with other lasers
            for(let j=0; j<lasers2.length; j++){
                if(collisionDetection(lasers[i].pt.x,lasers[i].pt.y,lasers[i].pt.r, lasers2[j].pt.x, lasers2[j].pt.y, lasers2[j].pt.r)){
                    //remove lasers from list
                    lasers2.splice(j,1);
                    lasers.splice(i,1); 
                    break;
                }
            }

        }

        for(let i=0; i< lasers2.length; i++){
            lasers2[i].show();
            lasers2[i].move();
            //is laser close to boundary --> remove
            if (Math.sqrt(sq(lasers2[i].pt.x)+sq(lasers2[i].pt.y)) >= 1-eps){
                lasers2.splice(i,1);
                break;
            }
            
            if(collisionDetection(lasers2[i].pt.x,lasers2[i].pt.y,lasers2[i].pt.r, ship.pos.x, ship.pos.y, ship.radius*2)){
                //GAME OVER
                gameover = 2;
                break;
            } 
        }
    
    }
    else{ //game over 
        if(gameover == 1)
            tag = createP("Player 1 won (red ship)");
        else    
            tag = createP("Player 2 won (blue ship)");
        tag.position(230,100);
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
        lasers.push(new PointMovingOnGeodesic(ship.pos.x,ship.pos.y,ship.heading.x,ship.heading.y,0.025,poincareDisk,0.015, [255,125,0]));
    } else if (keyCode == 65){ // a = left
        ship2.setRotation(0.05);
    } else if (keyCode == 68){ // d = right
        ship2.setRotation(-0.05);
    } else if (keyCode == 87){ // w = boost
        ship2.setBoostingState(true);
    } else if (keyCode == 16){ // SHIFT = create laser
        lasers2.push(new PointMovingOnGeodesic(ship2.pos.x,ship2.pos.y,ship2.heading.x,ship2.heading.y,0.025,poincareDisk,0.015, [0,125,255]));
    } 
}

function keyReleased(){
    if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW || keyCode == UP_ARROW){
        ship.setRotation(0);
        ship.setBoostingState(false);
    }
    if (keyCode == 65 || keyCode == 68 || keyCode == 87){
        ship2.setRotation(0);
        ship2.setBoostingState(false);
    }
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