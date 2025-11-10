import { API_BASE_URL } from "./api";

export function artworkImageUrl(a: { imageUrl?: string }) {
    if (!a.imageUrl) return "/placeholder.svg";
    if (a.imageUrl.startsWith("/")) return `${API_BASE_URL}${a.imageUrl}`;
    return a.imageUrl;
}
