
let accToken = null;

const notifyAuthChange = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:change", { detail: { token: getAccessToken() } }));
    }
};

export const getAccessToken = () => accToken;

export const setAccessToken = (token) => {
    accToken = token;
    notifyAuthChange();
};

export const clearAccessToken = () => {
    accToken = null;
    notifyAuthChange();
};

export const subscribeToAuthChanges = (callback) => {
    if (typeof window === "undefined") return () => {};

    const handleChange = () => callback(getAccessToken());
    window.addEventListener("auth:change", handleChange);

    return () => window.removeEventListener("auth:change", handleChange);
};