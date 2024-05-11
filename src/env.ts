interface Env {
    BACKEND_HOST?: string;
    BACKEND_PORT?: number;
}

export const env: Env = {
    BACKEND_HOST: process.env.REACT_APP_BACKEND_HOST,
    BACKEND_PORT: Number(process.env.REACT_APP_BACKEND_PORT),
};

if (env.BACKEND_HOST && env.BACKEND_HOST.endsWith('/')) {
    throw new Error('REACT_APP_BACKEND_HOST should not end with `/`.');
}

if (env.BACKEND_PORT && isNaN(env.BACKEND_PORT)) {
    throw new Error('REACT_APP_BACKEND_PORT variable is not a valid number.');
}

if (!env.BACKEND_HOST && !env.BACKEND_PORT) {
    throw new Error('REACT_APP_BACKEND_HOST and REACT_APP_BACKEND_PORT variable were not set. At least one should be provided.');
}
