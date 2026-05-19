/**
 * Converts the transformation matrix back into start and end points as [number, number],
 * without relying on external imports. This function includes matrix application logic internally.
 *
 * @param shapeWidth number
 * @param shapeHeight number
 * @param transform Transform
 * @returns { start: [number, number], end: [number, number] }
 */
export function convertMatrixToPointsNoRefs(
  shapeWidth: number,
  shapeHeight: number,
  transform: Transform
) {
  // Helper function to apply a transformation matrix to a point
  function applyMatrixToPoint(matrix: number[][], point: [number, number]): [number, number] {
    const x = point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2];
    const y = point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2];
    return [x, y];
  }

  // Normalize transformation for matrix calculation
  const normalizedTransform =
    transform.length === 2 ? [...transform, [0, 0, 1]] : [...transform];

  // Define start and end points in normalized space
  const startEndNormalized = [
    [0, 0.5],
    [1, 0.5]
  ];

  // Apply the matrix to compute points
  const points = startEndNormalized.map((point) =>
    applyMatrixToPoint(normalizedTransform, point)
  );

  return {
    start: [points[0][0] * shapeWidth, points[0][1] * shapeHeight],
    end: [points[1][0] * shapeWidth, points[1][1] * shapeHeight]
  };
}