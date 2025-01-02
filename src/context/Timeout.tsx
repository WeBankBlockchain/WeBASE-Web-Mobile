export type TimeoutError = Error & { code: string };

function createTimeoutError(): TimeoutError {
    const error = new Error('Request timed out');
    (error as TimeoutError).code = 'ETIMEDOUT';
    return error as TimeoutError;
}

export function checkIsTimeout(error: any) {
    return (error as TimeoutError).code === 'ETIMEDOUT'
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
        const timer = setTimeout(() => {
            reject(createTimeoutError());
        }, ms);
        // Clear the timeout if the original promise resolves first
        promise.finally(() => clearTimeout(timer));
    });
    return Promise.race([promise, timeoutPromise]);
}