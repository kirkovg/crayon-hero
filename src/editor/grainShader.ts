// Paper-tooth grain shader (SkSL) for the crayon look.
//
// Grain is a function of canvas-space coordinates, so it stays fixed relative to
// the "paper" — like real crayon wax catching on the tooth of the paper.
// `u_grain` controls how broken/textured the coverage is.
export const GRAIN_SRC = `
uniform float4 u_color;
uniform float  u_grain;

float hash(float2 p) {
  p = fract(p * float2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float a = hash(i);
  float b = hash(i + float2(1.0, 0.0));
  float c = hash(i + float2(0.0, 1.0));
  float d = hash(i + float2(1.0, 1.0));
  float2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

half4 main(float2 xy) {
  float tooth = vnoise(xy * 0.6);         // coarse paper tooth
  float fine  = vnoise(xy * 2.3 + 17.0);  // fine wax grain
  float grain = mix(tooth, fine, 0.5);

  float a = u_color.a * mix(1.0 - u_grain, 1.0, grain);
  a *= step(0.12, grain);                 // knock out low spots → broken coverage

  // Premultiplied output.
  return half4(u_color.rgb * a, a);
}
`;
