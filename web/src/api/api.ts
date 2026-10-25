const baseURL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

// 接口地址，供下载与第三方调用拼接
export const apiBaseURL = baseURL;

export const apiUrl = (path: string) => `${baseURL}${path}`;

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token");
  const headers = new Headers(init.headers);

  if (token) {
    headers.set("token", token);
  }

  // FormData 由浏览器生成边界，其余请求按 JSON 发送
  const isFormData = init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), { ...init, headers });
  if (!response.ok) {
    throw new Error(`请求失败，状态码 ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse<T>;

  // 令牌失效时清除本地登录态并回到登录页
  if (body.code === 401 && token) {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    window.location.href = "/";
    throw new Error(body.message);
  }

  return body;
}

export const get = <T>(path: string) => request<T>(path);

export const post = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "POST",
    body:
      data === undefined ? undefined : data instanceof FormData ? data : JSON.stringify(data),
  });
