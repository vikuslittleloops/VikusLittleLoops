import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ---- Products ----
export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => api.get("/products", { params }).then((r) => r.data),
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
  });
}

// ---- Categories / collections ----
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => api.get("/collections").then((r) => r.data),
  });
}

// ---- Homepage (admin-editable content) ----
export function useHomepage() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: () => api.get("/homepage").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

// ---- Featured reviews (homepage testimonials) ----
export function useFeaturedReviews(limit = 8) {
  return useQuery({
    queryKey: ["featured-reviews", limit],
    queryFn: () => api.get("/reviews/featured", { params: { limit } }).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

// ---- FAQs ----
export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => api.get("/faqs").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}
