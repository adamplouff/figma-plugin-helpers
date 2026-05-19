import { applyMatrixToPoint } from './applyMatrixToPoint';

/**
 * Converts the transformation matrix back into start and end points as [number, number].
 *
 * @param shapeWidth number
 * @param shapeHeight number
 * @param transform Transform
 * @returns { start: [number, number], end: [number, number] }
 */
export function convertMatrixToPoints(
  shapeWidth: number,
  shapeHeight: number,
  transform: Transform
) {
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