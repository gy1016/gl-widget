import { Renderer, Background, Clock, CAMERA } from './Renderer';
import { Vector3 } from './math/Vector3';
// import { Clock } from './Clock';
import * as backgroundShader from '../examples/background'
import * as shapeShader from '../examples/shape'

import * as font from '../examples/font/averia.json';
import { FontElement, Alignment } from './extras/plugins/Font'

const renderer: Renderer = new Renderer({
  cameraMode: CAMERA.ORTHOGRAPHIC,
  element: 'awesome-bg'
}, {});

let background: Background = new Background(backgroundShader.fluidShader);
let element = new FontElement('ab', font, {
  size: 1,
  alignment: Alignment.LEFTTOP
}, shapeShader.gradientShader)
// element.position.x = -1
// element.position = new Vector3(-2, 0, 0)
// element.scale.x = 0.5

// element.rotateY(0.5)
// element.rotateX(0.5)

renderer.render(background, element);


// test custom uniforms by users
// let clock = new Clock()
// function animate() {
//   renderer.setUniform(background, 'time', clock.getElapsedTime())
//   requestAnimationFrame(animate)
// }
// animate()
// document.body.appendChild(renderer.canvas);
