const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getApiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL সেট করা নেই");
  }

  return `${API_BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function fetchApi(path: string) {
  const response = await fetch(getApiUrl(path), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request ব্যর্থ হয়েছে: ${response.status}`);
  }

  return response.json();
}

export async function getProducts() {
  return fetchApi("products");
}

export async function getProductById(id: string) {
  return fetchApi(`products/${encodeURIComponent(id)}`);
}

export async function getCategories() {
  return fetchApi("categories");
}

export async function getCategoryBySlug(slug: string) {
  return fetchApi(`categories/${encodeURIComponent(slug)}`);
}