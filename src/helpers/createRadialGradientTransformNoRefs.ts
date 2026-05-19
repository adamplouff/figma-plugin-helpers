/**
 * This method computes a transformation matrix from the radius, center, and rotation
 * without relying on external imports. It applies the reverse operation to extractRadialGradientNoRefs.ts.
 *
 * @param shapeWidth number
 * @param shapeHeight number
 * @param radius [number, number]
 * @param center [number, number]
 * @param rotation number (in degrees)
 * @returns Transformation matrix (3x3)
 */
export function createRadialGradientTransformNoRefs(
  shapeWidth: number,
  shapeHeight: number,
  radius: [number, number],
  center: [number, number],
  rotation: number
): number[][] {
  // Helper function to create a rotation matrix
  function createRotationMatrix(angle: number): number[][] {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1]
    ];
  }

  // Scale matrix
  const scaleMatrix = [
    [radius[0] / shapeWidth, 0, 0],
    [0, radius[1] / shapeHeight, 0],
    [0, 0, 1]
  ];

  // Translation matrix
  const translateMatrix = [
    [1, 0, center[0] / shapeWidth],
    [0, 1, center[1] / shapeHeight],
    [0, 0, 1]
  ];

  // Rotation matrix
  const rotationMatrix = createRotationMatrix(rotation);

  // Combine translation, rotation, and scale matrices
  const transformMatrix = multiplyMatrices(
    translateMatrix,
    multiplyMatrices(rotationMatrix, scaleMatrix)
  );

  return transformMatrix;
}

/**
 * Helper function to multiply two 3x3 matrices
 */
function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const result = Array.from({ length: 3 }, () => Array(3).fill(0));
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}