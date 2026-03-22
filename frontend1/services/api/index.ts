const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example-hms.com/v1";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${NEXT_PUBLIC_API_URL}${endpoint}`;
  
  // Example of appending auth tokens here
  // const token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Request Failed: ${response.statusText}`);
  }

  return response.json();
}
