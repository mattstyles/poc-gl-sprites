
var Context = require( 'webgl-context' )
var Loop = require( 'canvas-loop' )
var Shader = require( 'gl-basic-shader' )
var SpriteBatch = require( 'gl-sprite-batch' )
var Texture = require( 'gl-texture2d' )
var Quay = require( 'quay' )
var Stats = require( 'stats.js' )

var baboon = require( 'baboon-image' )
var bunny = require( './bunny' )
var mat4 = require( 'gl-mat4')
var random = require( 'lodash.random' )

var stats = new Stats()
Object.assign( stats.domElement.style, {
  position: 'absolute',
  right: '0px',
  top: '0px',
  zIndex: 1000
})
document.body.appendChild( stats.domElement )

const MAX_SPRITES = 10000
const START_SPRITES = 1000

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

app.on( 'tick', dt => {
  stats.begin()
  render( dt )
  stats.end()
})

var shader = Shader( gl, {
  texcoord: true,
  color: true,
  normal: false
})

var batch = SpriteBatch( gl, {
  dynamic: true,
  capacity: MAX_SPRITES   // default 100
})

// var texture = Texture( gl, baboon )
var texture = Texture( gl, bunny )

var ortho = mat4.create()
var width = app.shape[ 0 ]
var height = app.shape[ 1 ]


class Sprite {
  constructor() {
    this.position = [ 0, 0 ]
    this.size = [ 32, 32 ]
    this.alpha = 1

    this.force = [ random( -2.1, 2.1 ), random( -2.1, 2.1 ) ]
  }

  update() {
    this.position[ 0 ] += this.force[ 0 ]
    this.position[ 1 ] += this.force[ 1 ]

    if ( this.position[ 1 ] > app.shape[ 1 ] ) {
      this.force[ 1 ] = 0 - this.force[ 1 ]
    }
    if ( this.position[ 1 ] < 0 ) {
      this.force[ 1 ] = 0 - this.force[ 1 ]
    }

    if ( this.position[ 0 ] > app.shape[ 0 ] ) {
      this.force[ 0 ] = 0 - this.force[ 0 ]
    }
    if ( this.position[ 0 ] < 0 ) {
      this.force[ 0 ] = 0 - this.force[ 0 ]
    }
  }
}

var sprite = new Sprite()
var sprites = []

function randomSprite() {
  let spr = new Sprite()
  spr.position[ 0 ] = random( 0, width )
  spr.position[ 1 ] = random( 0, height )
  // spr.size[ 0 ] += random( -64, 128 )
  // spr.size[ 1 ] += random( -64, 128 )
  // spr.alpha = random( .25, 1, true )
  return spr
}

for ( let i = 0; i < START_SPRITES - 1; i++ ) {
  sprites.push( randomSprite() )
}

/**
 * Controls
 */

var quay = new Quay()
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

quay.stream( '<space>' )
  .on( 'data', event => {
    for ( var i = 0; i < 200; i++ ) {
      sprites.push( randomSprite() )
    }
  })
  .on( 'keyup', event => {
    console.log( sprites.length )
  })

/**
 * Rendering
 */
function render( dt ) {

  /**
   * Basic stuff
   */
  gl.enable( gl.BLEND )
  gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)

  shader.bind()
  shader.uniforms.texture0 = 0

  mat4.ortho( ortho, 0, width, height, 0, 0, 1 )
  shader.uniforms.projection = ortho

  /**
   * Sprite batch stuff
   */
  batch.clear()
  batch.bind( shader )

  batch.shape = [ 32, 32 ]
  batch.color = [ 1, 1, 1, 1 ]
  batch.texture = texture

  for ( let i = 0; i < sprites.length; i++ ) {
    let spr = sprites[ i ]
    // batch.push({
    //   position: spr.position,
    //   shape: spr.size,
    //   color: [ 1, 1, 1, spr.alpha ],
    //   texture: texture
    // })
    batch.position = spr.position
    batch.push()
    spr.update()
  }

  // batch.push({
  //   position: sprite.position,
  //   shape: sprite.size,
  //   color: [ 1, 1, 1, 1 ],
  //   texture: texture
  // })

  batch.draw()

  batch.unbind()
}


//debug
window.app = app
window.gl = gl
window.sprite = sprite
window.sprites = sprites
