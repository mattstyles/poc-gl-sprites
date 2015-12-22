
var gl = require( 'webgl-context' )()
var Loop = require( 'canvas-loop' )
var Shader = require( 'gl-basic-shader' )
var SpriteBatch = require( 'gl-sprite-batch' )

var canvas = gl.canvas
document.body.appendChild( canvas )

var app = Loop( canvas, {
  scale: window.devicePixelRatio
})

app.start()

app.on( 'tick', render )

var shader = Shader( gl, {
  texCoord: true,
  color: true,
  normal: false
})

var batch = SpriteBatch( gl, {
  dynamic: true,
  capacity: 100   // default
})

function render( dt ) {
  
}
