
var Context = require( 'webgl-context' )
var Loop = require( 'canvas-loop' )
var Shader = require( 'gl-basic-shader' )
var SpriteBatch = require( 'gl-sprite-batch' )
var Texture = require( 'gl-texture2d' )
var Quay = require( 'quay' )

var baboon = require( 'baboon-image' )
var mat4 = require( 'gl-mat4')

var quay = new Quay()


var canvas = document.createElement( 'canvas' )
document.body.appendChild( canvas )

var app = Loop( canvas, {
  scale: window.devicePixelRatio
})

var gl = Context({
  canvas: canvas,
  width: app.shape[ 0 ],
  height: app.shape[ 1 ]
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

var sprite = {
  position: [ 0, 0 ],
  size: [ 128, 128 ]
}

quay.on( '<up>', () => sprite.position[ 1 ]-- )
quay.on( '<down>', () => sprite.position[ 1 ]++ )
quay.on( '<left>', () => sprite.position[ 0 ]-- )
quay.on( '<right>', () => sprite.position[ 0 ]++ )
quay.on( 'Q', () => {
  sprite.size[ 0 ] += 10
  sprite.size[ 1 ] += 10
})
quay.on( 'A', () => {
  sprite.size[ 0 ] -= 10
  sprite.size[ 1 ] -= 10
})

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
    position: sprite.position,
    shape: sprite.size,
    color: [ 1, 1, 1, 1 ],
    texture: texture
  })

  batch.draw()

  batch.unbind()
}


//debug
window.app = app
window.gl = gl
window.sprite = sprite
