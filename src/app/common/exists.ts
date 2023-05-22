/**
 * check null or undefined
 * @param value target value
 * @returns true if value, false otherwise
 */
export function exists<Type>(value: Type | null | undefined): value is Type {
    return value !== null && value !== undefined;
}

/**
 * check null or undefined
 * @param value target value
 * @returns false if value, true otherwise
 */
export function notExists<Type>(value: Type | null | undefined): value is null | undefined {
    return !exists(value);
}

/**
 * check null or undefined, thorow an exception if applicable.
 * @param value target value
 * @param target variable name to display in error
 */
export function assertExistCheck<Type>(value: Type | null | undefined, target = 'value'): asserts value is Type {
    if (notExists(value)) {
        throw new Error(`'${target}' should be specified.`);
    }
}
