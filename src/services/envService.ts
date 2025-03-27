export const getEnv = () => {
    return {
        publicApiUrl: import.meta.env.VITE_PUBLIC_API_URL,
    }
}