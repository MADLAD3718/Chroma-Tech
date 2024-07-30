import { Vector3 } from "./vectors";

/** A 3x3 Matrix. */
export class Matrix3 {
    /** The first column vector of the matrix. */
    u: Vector3;
    /** The second column vector of the matrix. */
    v: Vector3;
    /** The third column vector of the matrix. */
    w: Vector3;
    /**
     * Multiplies the matrix with a specified value.
     * @param x The specified value.
     * @returns The result of a matrix multiplication with `x`.
     */
    mul(x: Vector3 | Number): Vector3;
}

/**
 * Builds a TNB Matrix using a specified normal vector.
 * @param n The specified normal vector.
 * @returns A Tangent-Normal-Binormal Matrix based on the specified vector.
 */
export function buildTNB(n: Vector3): Matrix3;

/**
 * Transposes a specified matrix.
 * @param m The specified matrix.
 * @returns The transposed value of the specified matrix.
 */
export function transpose(m: Matrix3): Matrix3;

/**
 * Returns the determinant of the specified matrix.
 * @param m The specified matrix.
 * @returns The scalar value that represents the determinant of the `m` parameter.
 */
export function determinant(m: Matrix3): Number;

/**
 * Returns the trace of the specified matrix.
 * @param m The specified matrix.
 * @returns The scalar value that represents the trace of the `m` parameter.
 */
export function trace(m: Matrix3): Number;

/**
 * Returns the adjugate of the specified matrix.
 * @param m The specified matrix.
 * @returns The adjugate matrix of the `m` parameter.
 */
export function adjugate(m: Matrix3): Matrix3;

/**
 * Returns the inverse of the specified matrix.
 * @param m The specified matrix.
 * @returns The resulting inverse matrix of the `m` parameter.
 */
export function inverse(m: Matrix3): Matrix3;
