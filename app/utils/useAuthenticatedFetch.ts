export function useAuthenticatedFetch() {

  return async (url: string, options: RequestInit = {}) => {
    const token = await shopify.idToken()
    const response = fetch(`http://localhost:9090/api/v1/${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (!(await response).ok) {
      throw new Error(`Error Http-Request: ${(await response).status}`);
    }

    return (await response).json();
  };
}
