import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildPostUrl(post: any): string {
  if (post.source_type === "group") {
    return `https://www.facebook.com/groups/${post.source_id}/posts/${post.id.split("_")[1]}/`
  } else {
    return `https://www.facebook.com/${post.source_id}/posts/${post.id.split("_")[1]}/`
  }
}

export function buildUserUrl(userId: string): string {
  return `https://www.facebook.com/${userId}`
}

export function copyToClipboard(text: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // You can add a toast notification here if needed
      console.log("Copied to clipboard:", text)
    })
    .catch((err) => {
      console.error("Failed to copy:", err)
    })
}

export function downloadMedia(url: string, filename: string): void {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.target = "_blank"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
