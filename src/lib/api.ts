
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Products load করতে সমস্যা হয়েছে");
  }

  return response.json();
}

export async function getProductById(id: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product details load করা যায়নি");
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Categories load করতে সমস্যা হয়েছে");
  }

  return response.json();
}

export async function getCategoryBySlug(slug: string) {
  const response = await fetch(
    `${API_BASE_URL}/categories/${encodeURIComponent(slug)}`
  );

  if (!response.ok) {
    throw new Error("Category load করা যায়নি");
  }

  return response.json();
}
