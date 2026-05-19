/**
 * This method extracts the rotation (in degrees), center point, and radius for a radial gradient
 * without relying on external imports. It includes matrix inversion and point application logic internally.
 *
 * @param shapeWidth number
 * @param shapeHeight number
 * @param t Transform
 * @returns Object with 'rotation', 'center', and 'radius' values
 */
export function extractRadialGradientParamsNoRefs(
  shapeWidth: number,
  shapeHeight: number,
  t: number[][]
) {
  // Helper function to invert a 3x3 matrix
  function matrixInverse(matrix: number[][]): number[][] {
    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];

    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

    if (det === 0) {
      throw new Error("Matrix is not invertible");
    }

    const invDet = 1 / det;

    return [
      [
        (e * i - f * h) * invDet,
        (c * h - b * i) * invDet,
        (b * f - c * e) * invDet
      ],
      [
        (f * g - d * i) * invDet,
        (a * i - c * g) * invDet,
        (c * d - a * f) * invDet
      ],
      [
        (d * h - e * g) * invDet,
        (b * g - a * h) * invDet,
        (a * e - b * d) * invDet
      ]
    ];
  }

  // Helper function to apply a matrix to a point
  function applyMatrixToPoint(matrix: number[][], point: [number, number]): [number, number] {
    const x = point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2];
    const y = point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2];
    return [x, y];
  }

  // Normalize the transformation matrix to 3x3 if it is 2x3
  const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t];

  // Invert the transformation matrix
  const mxInv = matrixInverse(transform);

  // Calculate points in original space
  const centerPoint = applyMatrixToPoint(mxInv, [0.5, 0.5]);
  const rxPoint = applyMatrixToPoint(mxInv, [1, 0.5]);
  const ryPoint = applyMatrixToPoint(mxInv, [0.5, 1]);

  // Calculate radii and rotation angle
  const rx = Math.sqrt(
    Math.pow(rxPoint[0] - centerPoint[0], 2) +
      Math.pow(rxPoint[1] - centerPoint[1], 2)
  );
  const ry = Math.sqrt(
    Math.pow(ryPoint[0] - centerPoint[0], 2) +
      Math.pow(ryPoint[1] - centerPoint[1], 2)
  );
  const angle =
    Math.atan((rxPoint[1] - centerPoint[1]) / (rxPoint[0] - centerPoint[0])) *
    (180 / Math.PI);

  return {
    rotation: angle,
    center: [centerPoint[0] * shapeWidth, centerPoint[1] * shapeHeight],
    radius: [rx * shapeWidth, ry * shapeHeight]
  };
}