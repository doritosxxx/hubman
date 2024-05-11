import { env } from './env';

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        body: string,
    ) {
        super(!body ? '<Empty response body>' : body);
    }
}

interface RequestOptions<TBody> {
    /** A BodyInit object or null to set request's body. */
    body?: TBody;
    /** A string indicating how the request will interact with the browser's cache to set request's cache. */
    cache?: RequestCache;
    /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
    credentials?: RequestCredentials;
    /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
    headers?: Record<string, string>;
    /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
    integrity?: string;
    /** A boolean to set request's keepalive. */
    keepalive?: boolean;
    /** A string to set request's method. */
    method?: 'POST' | 'PATCH' | 'DELETE' | 'GET';
    /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
    mode?: RequestMode;
    /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
    redirect?: RequestRedirect;
    /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
    referrer?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
    /** A referrer policy to set request's referrerPolicy. */
    referrerPolicy?: ReferrerPolicy;
    /** An AbortSignal to set request's signal. */
    signal?: AbortSignal | null;
}

const HOST = env.BACKEND_HOST
    ? env.BACKEND_HOST
    : `${location.protocol}//${location.hostname}:${env.BACKEND_PORT}`;

const absolute = (url: `/${string}`) => `${HOST}/api${url}`;

export const api = {
    async fetch<TResponse, TBody = unknown>(url: `/${string}`, { headers = {}, ...options }: RequestOptions<TBody> = {}): Promise<TResponse> {
        const combinedHeaders = { ...headers };
        let body: any = options.body;

        if (options.body) {
            if (!combinedHeaders['Content-Type']) {
                combinedHeaders['Content-Type'] = 'application/json';
            }

            if (combinedHeaders['Content-Type'] == 'application/json') {
                body = JSON.stringify(options.body);
            }
        }

        const response = await window.fetch(absolute(url), {
            ...options,
            headers: combinedHeaders,
            body,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new ApiError(
                response.status,
                response.statusText,
                await response.text(),
            );
        }

        const contentType = response.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
            return response.json();
        }
        if (contentType.includes('application/x-yaml')) {
            return response.text() as TResponse;
        }

        return null as TResponse;
    },
};
