

class ToastError extends Error {

    code: string;

    /**
     * Creates a custom error with a code for toasts
     * @param message describing the error
     * @param code the short form error name
     */
    constructor(message: string, code: string) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, ToastError.prototype);
    }
}

export default ToastError;
