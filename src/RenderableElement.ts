
import { ShaderObject, Program } from "./Program";
import { BufferManager } from "./BufferManager";
import { BufferGeometry } from "./BufferGeometry";
import { Object3D } from "./Object3D";
import { UniformManager } from "./UniformManager";
import { RenderSide } from "./Constants";
import { ProgramManager } from "./ProgramManager";
import { Geometry } from "./Geometry";
import { Matrix4 } from "./math/index";
import { Vector3, Matrix3 } from "./math/index";


class RenderableElement extends Object3D {
  glProgram: WebGLProgram
  program: Program
  gl: WebGLRenderingContext
  vertexNum: number
  fragmentShader: string
  vertexShader: string
  uniforms: any
  geometry: Geometry
  bufferGeometry: BufferGeometry
  bufferManager: BufferManager
  uniformManager: UniformManager
  programManager: ProgramManager
  side: RenderSide
  transparent: boolean
  hasIndex: boolean;
  isRenderableElement: boolean = true
  type: string = ''
  constructor(material?: any, geometry?: Geometry | BufferGeometry) {
    super()
    this.vertexShader = `
        attribute vec3 position;
        varying vec3 vPosition;
        void main () {
          vPosition = position;
          gl_Position = vec4(position, 1.0);
        }
      ` 
    if (material.fragmentShader) {
      this.fragmentShader = material.fragmentShader
    }
    if (material.vertexShader) {
      this.vertexShader = material.vertexShader
    }
    if (material.uniforms) {
      this.uniforms = material.uniforms
    }
    Object.assign(this.uniforms, {
      cameraPosition: {
        value: new Vector3()
      },
      mvpMatrix: {
        value: new Matrix4()
      },
      modelMatrix: {
        value: new Matrix4()
      },
      viewMatrix: {
        value: new Matrix4()
      },
      modelViewMatrix: {
        value: new Matrix4()
      },
      projectionMatrix: {
        value: new Matrix4()
      },
      normalMatrix: {
        value: new Matrix3()
      },
      isOrthographic: {
        value: 0
      }
    })
    this.transparent = material.transparent || false
    this.side = material.side || RenderSide.FRONT
    if (geometry instanceof Geometry) {
      this.geometry = geometry
      this.bufferGeometry = this.geometry.toBufferGeometry()
    } else {
      this.bufferGeometry = geometry
    }
    
    this.programManager = new ProgramManager()
  }

  getVertexNum(): number {
    return this.vertexNum
  }
  getProgram(): WebGLProgram {
    return this.glProgram
  }

  update(gl, material?:any ) {
    let shader: ShaderObject = material ? material : {
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    }

    
    this.program = this.programManager.getProgram(gl, shader)
    this.glProgram = this.program.program
    // if (!this.program) {
    //   this.program  = new Program(gl, shader)
    //   this.glProgram = this.program.program
    // }
    gl.useProgram(this.glProgram)
    this.updateBuffer(gl)
    this.updateUniforms(gl)
    
  }
  updateGeometry(gl) {
    if (!this.bufferManager) {
      this.bufferManager = new BufferManager()
    
    }
    if (this.geometry) {
      this.bufferGeometry = this.geometry.toBufferGeometry()
    }
    let format: any = this.bufferManager.initBuffer(gl, this.glProgram, this.bufferGeometry)
    this.vertexNum = format.count
    this.hasIndex = format.hasIndex
  }
  updateBuffer(gl) {
    if (!this.bufferManager) {
      this.bufferManager = new BufferManager()
      let format: any = this.bufferManager.initBuffer(gl, this.glProgram, this.bufferGeometry)
      this.vertexNum = format.count
      this.hasIndex = format.hasIndex
    } else {
      this.bufferManager.bindBuffer(gl, this.glProgram, this.bufferGeometry)
    }  
  }
  updateUniforms(gl) {
    this.program.uniformManager.updateUniforms(this.uniforms)
  }
}
export {
  RenderableElement
} 