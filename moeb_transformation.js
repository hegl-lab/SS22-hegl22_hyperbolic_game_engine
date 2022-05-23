function moebtransform(pos, C, R){ //position is a vector 
    //var a=-1*(C.x - R), b=1*(C.x+R), c=-1, d = 1;
    var a = 1, b=-1*(C.x+R), c=1, d=-1*(C.x-R);

    var newPositionX = (a*pos.x + b)/(c*pos.x+d); 
    var newPositionY = (a*pos.y)/(c*pos.y);

    return createVector(newPositionX, newPositionY); //returns transformed position
}
