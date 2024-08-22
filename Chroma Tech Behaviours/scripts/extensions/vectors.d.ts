export type Vector3 = {x: Number, y: Number, z: Number}

export enum Directions {
    Up = { x: 0, y: 1, z: 0 },
    Down = { x: 0, y: -1, z: 0 },
    North = { x: 0, y: 0, z: -1 },
    South = { x: 0, y: 0, z: 1 },
    East = { x: 1, y: 0, z: 0 },
    West = { x: -1, y: 0, z: 0 },
}

/**
 * Returns a vector equivalent of the given face direction.
 * @param direction The string direction.
 * @returns The corresponding {@link Vector3} equivalent to the provided direction.
 */
export function strToDir(direction: string): Vector3;

/**
 * Returns a string equivalent of the given vector direction.
 * @param direction The vector direction.
 * @returns The corresponding direction string equivalent to the provided direction.
 */
export function dirToStr(direction: Vector3): String;

/**
 * Constructs a vector with all components equal to a specified value.
 * @param x The specified value.
 * @returns A vector with all components equal to `x`.
 */
export function toVec(x: Number): Vector3;

/**
 * Stringifies a specified vector.
 * @param v The specified vector.
 * @returns A stringified version of the `v` parameter.
 */
export function stringifyVec(v: Vector3): String;

/**
 * Parses a stringified vector.
 * @param s The specified string value.
 * @returns The parsed vector from the `s` parameter.
 */
export function parseVec(s: String): Vector3;

/**
 * Determines if any components of the specified vector are non-zero.
 * @param v The specified vector.
 * @returns **True** if any components of the `v` parameter are non-zero; otherwise, **False**.
 * @remarks This function is similar to the **all** function. The **any** function determines 
 * if any components of the specified vector are non-zero, while the **all** function determines if all 
 * components of the specified vector are non-zero.
 */
export function any(v: Vector3): Boolean;

/**
 * Determines if all components of the specified vector are non-zero.
 * @param v The specified vector.
 * @returns **True** if all components of the `v` parameter are non-zero; otherwise, **False**.
 * @remarks This function is similar to the **any** function. The **any** function determines 
 * if any components of the specified vector are non-zero, while the **all** function determines if all 
 * components of the specified vector are non-zero.
 */
export function all(v: Vector3): Boolean;

/**
 * Determines if the specified vector is NaN.
 * @param v The specified vector.
 * @returns Returns **True** if the `v` parameter is NaN. Otherwise, **False**.
 */
export function isnan(v: Vector3): Boolean;

/**
 * Determines if the specified vector is infinite.
 * @param v The specified vector.
 * @returns Returns **True** if the `v` parameter is +Infinity or -Infinity. Otherwise, **False**.
 */
export function isinf(v: Vector3): Boolean;

/**
 * Determines if the specified vector is finite.
 * @param v The specified vector.
 * @returns Returns **True** if the `v` parameter is finite; otherwise **False**.
 */
export function isfinite(v: Vector3): Boolean;

/**
 * Determines if two vectors are equal.
 * @param u The first specified vector.
 * @param v The second specified vector.
 * @returns `true` if every component of `u` is equal to those in `v`, otherwise `false`.
 */
export function equal(u: Vector3, v: Vector3): Boolean;

/**
 * Selects the lesser of `u` and `v`.
 * @param u The `u` input value.
 * @param v The `v` input value.
 * @return The `u` or `v` parameter, whichever is the smallest value.
 */
export function min(u: Vector3, v: Vector3): Vector3;

/**
 * Selects the greater of `u` and `v`.
 * @param u The `u` input value.
 * @param v The `v` input value.
 * @return The `u` or `v` parameter, whichever is the largest value.
 */
export function max(u: Vector3, v: Vector3): Vector3;

/**
 * Clamps the specified vector to the specified minimum and maximum range.
 * @param v A value to clamp.
 * @param min The specified minimum range.
 * @param max The specified maximum range.
 * @returns The clamped value for the `v` parameter.
 */
export function clamp(v: Vector3, min: Vector3, max: Vector3): Vector3;

/**
 * Returns the sign of `v`.
 * @param v The input value.
 * @returns `-1` if `v` is less than zero; `0` if `v` equals zero; and `1` if `v` is greater than zero.
 */
export function sign(v: Vector3): Vector3;

/**
 * Returns the largest integer that is less than or equal to the specified vector.
 * @param v The specified vector.
 * @returns The largest integer value that is less than or equal to the `v` parameter.
 */
export function floor(v: Vector3): Vector3;

/**
 * Returns the smallest integer value that is greater than or equal to the specified vector.
 * @param v The specified vector.
 * @returns The smallest integer value that is greater than or equal to the `v` parameter.
 */
export function ceil(v: Vector3): Vector3;

/**
 * Returns the fractional (or decimal) part of `v`; which is greater than or equal to 0 and less than 1.
 * @param v The specified vector.
 * @returns The fractional part of the `v` parameter.
 */
export function frac(v: Vector3): Vector3;

/**
 * Rounds the specified vector to the nearest integer. Halfway cases are rounded to the nearest even.
 * @param v The specified vector.
 * @returns The `v` parameter, rounded to the nearest integer.
 */
export function round(v: Vector3): Vector3;

/**
 * Returns the remainder of `u`/`v`.
 * @param u The dividend.
 * @param v The divisor.
 * @returns The remainder of the `u` parameter divided by the `v` parameter.
 * @remarks The remainder is calculated such that *x* = *i* * *y* + *f*, where *i* is an integer, 
 * *f* has the same sign as *x*, and the absolute value of *f* is less than the absolute value of *y*.
 */
export function mod(u: Vector3, v: Vector3): Vector3;

/**
 * Negates a specified vector `v`.
 * @param v The specified vector.
 * @returns The negation of the `v` parameter.
 */
export function neg(v: Vector3): Vector3;

/**
 * Returns the absolute value of the specified vector.
 * @param v The specified vector.
 * @returns The absolute value of the `v` parameter.
 */
export function abs(v: Vector3): Vector3;

/**
 * Adds two vectors `u` and `v` together. 
 * @param u The first value.
 * @param v The second value.
 * @returns The result of the addition `u` + `v`.
 */
export function add(u: Vector3, v: Vector3): Vector3;

/**
 * Subtracts a vector `v` from a vector `u`. 
 * @param u The first value.
 * @param v The second value.
 * @returns The result of the subtraction `u` - `v`.
 */
export function sub(u: Vector3, v: Vector3): Vector3;

/**
 * Multiplies a vector `v` by a vector or scalar `s`. 
 * @param v The multiplicand value.
 * @param s The multiplier value.
 * @returns The component-wise multiplication of `v` and `s`.
 */
export function mul(v: Vector3, s: Vector3 | Number): Vector3;

/**
 * Divides a vector `v` by a vector or scalar `s`. 
 * @param v The dividend value.
 * @param s The divisor value.
 * @returns The component-wise division of `v` and `s`.
 */
export function div(v: Vector3, s: Vector3 | Number): Vector3;

/**
 * Returns the square root of the specified vector, per component.
 * @param v The specified vector.
 * @returns The square root of the `v` parameter, per component.
 */
export function sqrt(v: Vector3): Vector3;

/**
 * Returns the base-e exponential of the specified vector.
 * @param v The specified vector.
 * @returns The base-e exponential of the `v` parameter.
 */
export function exp(v: Vector3): Vector3;

/**
 * Returns the base 2 exponential of the specified vector.
 * @param v The specified vector.
 * @returns The base 2 exponential of the `v` parameter.
 */
export function exp2(v: Vector3): Vector3;

/**
 * Returns the base-e logarithm of the specified vector.
 * @param v The specified vector.
 * @returns The base-e logarithm of the `v` parameter.
 */
export function log(v: Vector3): Vector3;

/**
 * Returns the base-10 logarithm of the specified vector.
 * @param v The specified vector.
 * @returns The base-10 logarithm of the `v` parameter.
 */
export function log10(v: Vector3): Vector3;

/**
 * Returns the base-2 logarithm of the specified vector.
 * @param v The specified vector.
 * @returns The base-2 logarithm of the `v` parameter.
 */
export function log2(v: Vector3): Vector3;

/**
 * Returns the specified vector raised to the specified power.
 * @param v The specified vector.
 * @param e The specified power.
 * @returns The `v` parameter raised to the power of the `p` parameter.
 */
export function pow(v: Vector3, e: Vector3 | Number): Vector3;

/**
 * Returns the sine of the specified vector.
 * @param v The specified vector, in radians.
 * @returns The sine of the `v` parameter.
 */
export function sin(v: Vector3): Vector3;

/**
 * Returns the arcsine of the specified vector.
 * @param v The specified vector.
 * @returns The arcsine of the `v` parameter.
 */
export function asin(v: Vector3): Vector3;

/**
 * Returns the hyperbolic sine of the specified vector.
 * @param v The specified vector, in radians.
 * @returns The hyperbolic sine of the `v` parameter.
 */
export function sinh(v: Vector3): Vector3;

/**
 * Returns the hyperbolic arcsine of the specified vector.
 * @param v The specified vector.
 * @returns The hyperbolic arcsine of the `v` parameter.
 */
export function asinh(v: Vector3): Vector3;

/**
 * Returns the cosine of the specified vector.
 * @param v The specified vector, in radians.
 * @returns The cosine of the `v` parameter.
 */
export function cos(v: Vector3): Vector3;

/**
 * Returns the arccosine of the specified vector.
 * @param v The specified vector. Each component should be a value within the range of -1 to 1.
 * @returns The arccosine of the `v` parameter.
 */
export function acos(v: Vector3): Vector3;

/**
 * Returns the hyperbolic cosine of the specified vector.
 * @param v The specified vector, in radians.
 * @returns The hyperbolic cosine of the `v` parameter.
 */
export function cosh(v: Vector3): Vector3;

/**
 * Returns the hyperbolic arccosine of the specified vector.
 * @param v The specified vector. Each component should be a value within the range of -1 to 1.
 * @returns The hyperbolic arccosine of the `v` parameter.
 */
export function acosh(v: Vector3): Vector3;

/**
 * Returns the tangent of the specified vector.
 * @param v The specified vector, in radians.
 * @returns The tangent of the `v` parameter.
 */
export function tan(v: Vector3): Vector3;

/**
 * Returns the arctangent of the specified vector.
 * @param v The specified vector.
 * @returns The arctangent of the `v` parameter. This value is within the range of -π/2 to π/2.
 */
export function atan(v: Vector3): Vector3;

/**
 * Returns the hyperbolic tangent of the specified vector.
 * @param v The specified vector, in radians.
 * @returns The hyperbolic tangent of the `v` parameter.
 */
export function tanh(v: Vector3): Vector3;

/**
 * Returns the hyperbolic arctangent of the specified vector.
 * @param v The specified vector.
 * @returns The hyperbolic arctangent of the `v` parameter. 
 */
export function atanh(v: Vector3): Vector3;

/**
 * Returns the dot product of two vectors.
 * @param u The first vector.
 * @param v The second vector.
 * @returns The dot product of the `u` parameter and the `v` parameter.
 */
export function dot(u: Vector3, v: Vector3): Number;

/**
 * Returns the cross product of two vectors.
 * @param u The first vector.
 * @param v The second vector.
 * @returns The cross product of the `u` parameter and the `v` parameter.
 */
export function cross(u: Vector3, v: Vector3): Vector3;

/**
 * Returns the length of the specified vector.
 * @param v The specified vector.
 * @returns A scalar that represents the length of the `v` parameter.
 */
export function length(v: Vector3): Number;

/**
 * Normalizes the specified vector according to `v` / length(`v`).
 * @param v The specified vector.
 * @returns The normalized `v` parameter.
 */
export function normalize(v: Vector3): Vector3;

/**
 * Returns a distance scalar between two vectors.
 * @param u The first vector to compare.
 * @param v The second vector to compare.
 * @returns A scalar value that represents the distance between the `u` parameter and the `v` parameter.
 */
export function distance(u: Vector3, v: Vector3): Number;

/**
 * Projects a vector `u` onto a vector `v`.
 * @param u The first value.
 * @param v The second value.
 * @returns The vector projection of the `u` parameter onto the `v` parameter.
 */
export function project(u: Vector3, v: Vector3): Vector3;

/**
 * Gets the rejection a vector `u` from a vector `v`.
 * @param u The first value.
 * @param v The second value.
 * @returns The vector rejection of the `u` parameter from the `v` parameter.
 */
export function reject(u: Vector3, v: Vector3): Vector3;

/**
 * Returns a reflection vector using an incident ray and a surface normal.
 * @param i An incident vector.
 * @param n A normal vector.
 * @returns A reflection vector.
 * @remarks This function calculates the reflection vector using the following formula: *v* = *i* - 2 * *n* * dot(*i*, *n*).
 */
export function reflect(i: Vector3, n: Vector3): Vector3;

/**
 * Returns a refraction vector using an incident ray, a surface normal, and a refraction index.
 * @param i An incident direction vector.
 * @param n A surface normal vector.
 * @param eta The ratio of refractive indices between the exiting medium and the entering medium.
 * @returns A floating-point, refraction vector. If the angle between the incident ray `i` and the surface normal `n` is too great 
 * for a given refraction index `e`, the return value is `(0,0,0)`.
 */
export function refract(i: Vector3, n: Vector3, eta: Number): Vector3;

/**
 * Rotates a vector `v` accross an axis `k` by angle `t`.
 * @param k The unit rotation axis vector.
 * @param t The angle to rotate about the axis.
 * @param v The vector to be rotated.
 * @returns The input parameter `v` rotated about `k` by the specified angle `t`.
 */
export function rotate(k: Vector3, t: Number, v: Vector3): Vector3;

/**
 * Performs a linear interpolation.
 * @param u The first value.
 * @param v The second value.
 * @param t A value that linearly interpolates between the `u` parameter and the `v` parameter.
 * @returns The result of the linear interpolation.
 * @remarks Linear interpolation is based on the following formula: *x*\*(1-*s*) + *y*\**s* which can 
 * equivalently be written as *x* + *s*\*(*y*-*x*).
 */
export function lerp(u: Vector3, v: Vector3, t: Vector3 | Number): Vector3;

/**
 * Performs a spherical linear interpolation.
 * @param u The first value.
 * @param v The second value.
 * @param t A value that spherically interpolates between the `u` parameter and the `v` parameter.
 * @returns The result of the spherical linear interpolation.
 */
export function slerp(u: Vector3, v: Vector3, t: Vector3 | Number): Vector3;

/**
 * Returns the cardinal angle of a vector `v` in the xz-plane.
 * @param v The specified vector.
 * @returns The cardinal angle of the vector.
 */
export function cardinalAngle(v: Vector3): Number;
