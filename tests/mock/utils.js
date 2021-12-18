import API_ERROR from 'base-api-client/lib/Error';

export function axiosResponse(data) {
    return { data: { result: data } };
}

export function axiosError(message, data) {
    const err = new Error(message);

    err.response = { data };

    return new API_ERROR(err);
}
