/**
 * This method creates a 2x3 linear gradient transformation matrix from pixel-space
 * start and end points. It performs the inverse of
 * `extractLinearGradientParamsFromTransformNoRefs` by producing a transform that maps
 * normalized gradient coordinates back into the provided shape space.
 *
 * @param shapeWidth number
 * @param shapeHeight number
 * @param start [number, number] start point in shape space
 * @param end [number, number] end point in shape space
 * @returns 2x3 transformation matrix
 */
export function extractLinearGradientMatrix(
  shapeWidth: number,
  shapeHeight: number,
  start: [number, number],
  end: [number, number]
): Transform {
  const startNorm: [number, number] = [start[0] / shapeWidth, start[1] / shapeHeight];
  const endNorm: [number, number] = [end[0] / shapeWidth, end[1] / shapeHeight];

  const dx = endNorm[0] - startNorm[0];
  const dy = endNorm[1] - startNorm[1];

  const transformX = startNorm[0];
  const transformY = startNorm[1];

  return [
    [dx, -dy, transformX + dy * 0.5],
    [dy, dx, transformY - dx * 0.5]
  ];
}
