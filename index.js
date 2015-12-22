
var gl = require( 'webgl-context' )()

var Loop = require( 'canvas-loop' )
var Shader = require( 'gl-basic-shader' )
var SpriteBatch = require( 'gl-sprite-batch' )
var Texture = require( 'gl-texture2d' )

var baboon = require( 'baboon-image' )
var mat4 = require( 'gl-mat4')


var canvas = gl.canvas
document.body.appendChild( canvas )

var app = Loop( canvas, {
  scale: window.devicePixelRatio
})

app.start()

app.on( 'tick', render )

var shader = Shader( gl, {
  texcoord: true,
  color: true,
  normal: false
})

var batch = SpriteBatch( gl, {
  dynamic: true,
  capacity: 100   // default
})

var texture = Texture( gl, baboon )

var ortho = mat4.create()
var width = app.shape[ 0 ]
var height = app.shape[ 1 ]

function render( dt ) {

  gl.enable( gl.BLEND )
  gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )

  shader.bind()
  shader.uniforms.texture0 = 0

  mat4.ortho( ortho, 0, width, height, 0, 0, 1 )
  shader.uniforms.projection = ortho

  batch.clear()
  batch.bind( shader )

  batch.push({
    position: [ 0, 0 ],
    shape: [ 128, 128 ],
    color: [ 1, 1, 1, 1 ],
    texture: texture
  })

  batch.draw()

  batch.unbind()
}


//debug
window.app = app
window.gl = gl
