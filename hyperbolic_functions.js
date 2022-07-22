//calculate hyperbolic distance between two points
function hyperbolicDistance(x1,y1,x2,y2){ //p1 = (x1,y1); p2 = (x2,y2)
    var delta = 2*sq(poincareDisk.r)*((sq(x1-x2)+sq(y1-y2))/((sq(poincareDisk.r)-(sq(x1)+sq(y1)))*(sq(poincareDisk.r)-(sq(x2)+sq(y2)))));
    return Math.acosh(1+delta);
}

function arg(a) {
    let mult = 0;
    if(a[0] <0) {
        mult = 1;
    }
    return atan(a[1]/a[0]) + mult * PI;
}

function sub2(a,b) {
    return [a[0] - b[0], a[1] - b[1]];
}

function add2(a,b) {
    return [a[0] + b[0], a[1] + b[1]];
}

function mog(a) {
    return sq(a[0]) + sq(a[1]);
}

function car(a) {
    return [a[0] * cos(a[1]), a[0] * sin(a[1])];
}

function mul(a,b) {
    return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

//calculate radius shown for objects on the canvas depending on position of objects
function constructCanvasPosRadius(x,y,r){
    let a = sqrt(mog([x,y]));
    let angle = arg([x,y]);
    let pm = ((1+a) * exp(r) - (1-a)) / ((1 + a) * exp(r) + (1 - a));
    let p_koordinate = car([pm,angle]);
    let qm = ((1+ a) - (1 - a)*exp(r)) / ((1 + a) + (1 - a) * exp(r));
    let q_koordinate = car([qm,angle]);
    let b = mul(add2(p_koordinate,q_koordinate), [0.5, 0]);
    let l = 0.5 * sqrt(mog(sub2(p_koordinate,q_koordinate)));
    return [b,l];
}