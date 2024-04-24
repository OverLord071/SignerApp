export interface Errors {
    [key: string]: string;
}

export const validateField = (value: string, pattern: string) => {
    if (pattern) {
        const regex = new RegExp(pattern);
        return regex.test(value);
    }
    return true;
};