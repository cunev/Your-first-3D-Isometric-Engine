let rotX = 0
let rotY = 50
let zoom = 2

let cx = 500/2
let cy = 500/2
let clr = 0

function setup(){
    createCanvas(500, 500)
    angleMode(DEGREES)
    noSmooth()
}

function abtw(x1,y1,x2,y2){
    return Math.atan2(y2-y1,x2-x1)
}

function linea2d(x,y,d,a){
    for (let i = 0; i < d; i++) {
        set(x+i*cos(a), y+i*sin(a), clr)
    }
}

function line2d(x1,y1,x2,y2){
    linea2d(x1,y1,dist(x1,y1,x2,y2),abtw(x1,y1,x2,y2)*180/PI)
}

function poly2d(x,y,z,r,l){
    let divisor = 360/l
    let edges = []

    for (let i = 0; i < l; i++) {
        line3d(
            x+r*cos(i*divisor),
            y+r*sin(i*divisor),
            z,

            x+r*cos((i+1)*divisor),
            y+r*sin((i+1)*divisor),
            z,
        )
        edges.push({
            x:x+r*cos(i*divisor),
            y:y+r*sin(i*divisor),
            z:z
        })
    }

    return edges
}


function point3d(x,y,z){
    set(
        cx+(x)*zoom*cos(rotX-90) + y*zoom*cos(rotX) , 
        cy+(x*zoom*sin(rotY))*sin(rotX-90) +y*zoom*sin(rotY)*sin(rotX) +z*zoom*cos(rotY),
        clr
    )
    
}
function getProjection(x,y,z){
    return {
        x:cx+(x)*zoom*cos(rotX-90) + y*zoom*cos(rotX),
        y:cy+(x*zoom*sin(rotY))*sin(rotX-90) +y*zoom*sin(rotY)*sin(rotX) +z*zoom*cos(rotY)
    }
}

function line3d(x1,y1,z1,x2,y2,z2){
    line2d(
        getProjection(x1,y1,z1).x,
        getProjection(x1,y1,z1).y,
        getProjection(x2,y2,z2).x,
        getProjection(x2,y2,z2).y,
    )
}

function draw(){
    background(200)
    loadPixels();

    // rotY+=1
    rotX+=2
    poly2d(0,0,65,40,3).forEach(e=>{
        line3d(0,0,0,e.x,e.y,e.z)
    })
    updatePixels();
}

