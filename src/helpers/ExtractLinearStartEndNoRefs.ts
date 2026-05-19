/**
 * This method extracts the x and y positions of the start and end of a linear gradient
 * without relying on external imports. It inverts the transformation matrix and applies
 * it to normalized start and end points.
 *
 * @param shapeWidth number
 * @param shapeHeight number
 * @param t Transform
 * @returns Object with 'start' and 'end' points as [number, number]
 */
export function extractLinearGradientParamsFromTransformNoRefs(
  shapeWidth: number,
  shapeHeight: number,
  t: Transform
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

  // Define normalized start and end points of the gradient
  const startEnd = [
    [0, 0.5], // Start in normalized space
    [1, 0.5]  // End in normalized space
  ].map((p) => applyMatrixToPoint(mxInv, p));

  return {
    start: [startEnd[0][0] * shapeWidth, startEnd[0][1] * shapeHeight],
    end: [startEnd[1][0] * shapeWidth, startEnd[1][1] * shapeHeight]
  };
}