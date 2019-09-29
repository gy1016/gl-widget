  precision mediump float;
  uniform vec2 resolution;
  uniform float     time; 
  void main () {
  vec2 uv = gl_FragCoord.xy/resolution.xy;   
  vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));
  gl_FragColor = vec4(col,1.0);
  }