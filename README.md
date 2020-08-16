![header](https://i.imgur.com/8XSjkV8.jpg)

# Your first 3D Isometric Engine


## Getting Started

The challenge is, to make a 3 dimensional isometric rendering engine from scratch, using nothing but a setPixel function. This can be considered as a geometry problem, because programming logic, is barely involved.

To get started, first of all you will need a simple graphics engine, that can setPixels at given coordinates - in my case i will use p5.js's set() function, because i'm mostly familiar with JavaScript, but you can use any other renderer such as pygame.

**In this guide we'll go through the following steps:**
- Setting up the environiment
- Translating a 3 dimensional point to a 2 dimensional canvas ( point(x,y,z) function )
- Making a line function
- Having fun with random shapes


## Setting up the environiment

A 3-dimensional observer has the following properties -
- A 2 axes view angle ( X and Y in degrees )
- Zoom ( optional , but a good feature )

```javascript
let rotX = 0
let rotY = 45
let zoom = 1
```

And we'll also declare variables for our canvas center.

```javascript
let canvasSize = 500 // A square
let cx = canvasSize/2
let cy = canvasSize/2
```

If you are also using p5JS , the setup function should look similar to this:

```javascript
function setup(){
    createCanvas(canvasSize, canvasSize)
    angleMode(DEGREES)
}
```

This is the draw function:
```javascript
function draw(){
    background(200)
    loadPixels();

    // code goes here brr.
    
    updatePixels();
}
```
We'll use it later to draw shapes.

> Make sure, you are working with degrees, else you will have to either set the view-angles in radians or multiply every trigonometric function parameter by PI/180.

### We'll also have to create some useful math functions such as -
- Distance between two vectors

**This is essentially Pythagoras theorem, so you can try make it yourself.**
```javascript
function dist(x1,y1,x2,y2){
  return Math.sqrt(pow(y2-y1,2)+pow(x2-x1,2))
}
```

- Angle between two vectors

```javascript
function abtw(x1,y1,x2,y2){
    return Math.atan2(y2-y1,x2-x1)
}
```

## Translating a 3 dimensional point to a 2 dimensional canvas ( point(x,y,z) function )

Here comes the hard part, and trigonometric knowledge is essential to make it from scratch.

In order to draw lines and points that *look 3d* , we should create the illusion of 3-dimensions.

A straight forward **solution** to this is:

**For the X axis**
```
CENTER_X + ( OFFSET_X * cos( X_VIEWANGLE - 90) ) + ( OFFSET_Y * cos( X_VIEWANGLE ) )
```
**For the Y axis**
```
CENTER_Y + ( OFFSET_X * sin( Y_VIEWANGLE ) * sin( X_VIEWANGLE - 90 ) ) + ( OFFSET_Y * sin( Y_VIEWANGLE ) * sin( X_VIEWANGLE ) + OFFSET_Y * cos( Y_VIEWANGLE ) )
```


```javascript
function getProjection(x,y,z){
    return {
        x:cx + x*cos(rotX-90) + y*cos(rotX),
        y:cy + x*sin(rotY)*sin(rotX-90) + y*sin(rotY)*sin(rotX) + z*cos(rotY)
    }
}
```

and let's pump it up with the zoom feature ( a multiplication basically. )
```javascript
function getProjection(x,y,z){
    return {
        x:cx + x*zoom*cos(rotX-90) + y*zoom*cos(rotX),
        y:cy + (x*zoom*sin(rotY))*sin(rotX-90) + y*zoom*sin(rotY)*sin(rotX) + z*zoom*cos(rotY)
    }
}
```

... and that's it, the 2d position on your canvas of a 3d positioned object can be extracted from this function.

You can test it via your setPixel function.

```javascript
let point = { x: 10, y:15, z:-20 }
set( getProjection(point.x,point.y,point.z).x , getProjection(point.x,point.y,point.z).y )
```

The appearance of the point is, of course dependant on your view angle.

## Making a 3-dimensional line function

Here's my solution to draw a line from point A to point B, this can be reduced down to a function.
```javascript
function linea2d(x,y,d,a){
    for (let i = 0; i < d; i++) {
        set(x+i*cos(a), y+i*sin(a), clr)
    }
}
function line2d(x1,y1,x2,y2){
    linea2d(x1,y1,dist(x1,y1,x2,y2),abtw(x1,y1,x2,y2)*180/PI)
}
```

The first function draws a stream of points at an angle.

The second one uses the first function to draw between two vectors, using distance and abtw function.


**Therefore we should just draw a 3d line between two translated points.***
```javascript
function line3d(x1,y1,z1,x2,y2,z2){
    line2d(
        getProjection(x1,y1,z1).x,
        getProjection(x1,y1,z1).y,
        getProjection(x2,y2,z2).x,
        getProjection(x2,y2,z2).y,
    )
}
```


## That's it, now let's have fun with some shapes.

I made a small function to create a polygon, and just connected all the vertices to a point to make a **n-hedron shape**.

```javascript
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
```

and inside the draw function

```javascript
function draw(){
    background(200)
    loadPixels();

    rotX+=2
    poly2d(0,0,65,40,6).forEach(e=>{
        line3d(0,0,0,e.x,e.y,e.z)
    })
    
    updatePixels();
}
```
Here's the result:

![result](https://i.imgur.com/LPWSpAs.gif)


## Happy coding!
