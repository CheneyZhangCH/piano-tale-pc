/**
 * @template T
 * @typedef SuccessApiResponse
 * @property {number} code
 * @property {T} data
 * @property {null} message
 * @property {true} ok
 */

/**
 * @typedef FailedApiResponse
 * @property {number} code
 * @property {null} data
 * @property {string} message
 * @property {false} ok
 */

/**
 * @template T
 * @typedef {SuccessApiResponse<T> | FailedApiResponse} ApiResponse
 */

class NumericError extends Error {
    /**
     * @param {string} message
     * @param {number} number
     */
    constructor(message, number) {
        super(message)
        this.number = number
    }
}

/**
 * @template T
 * @param {ApiResponse<T>} response
 * @returns {T}
 */
export default response => {
    if (response.ok) {
        return response.data
    } else {
        throw new NumericError(response.message, response.code)
    }
}
