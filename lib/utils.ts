import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const convertGoogleDriveUrl = (url: string): string => {
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  if (fileIdMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`
  }
  return url
}

export const extractFacebookId = (input: string): string => {
  if (!input.trim()) return ""

  if (/^\d+$/.test(input.trim())) {
    return input.trim()
  }

  const patterns = [
    /facebook\.com\/groups\/([^/?]+)/,
    /facebook\.com\/groups\/(\d+)/,
    /facebook\.com\/([^/?]+)(?:\/|$)/,
    /facebook\.com\/pages\/[^/]+\/(\d+)/,
    /facebook\.com\/profile\.php\?id=(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return input.trim()
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const buildPostUrl = (post: any): string => {
  if (post.permalink_url) {
    return post.permalink_url
  }

  const cleanPostId = post.id.includes("_") ? post.id.split("_")[1] : post.id

  if (post.source_type === "group") {
    return `https://www.facebook.com/groups/${post.source}/posts/${cleanPostId}`
  } else if (post.source_type === "page") {
    return `https://www.facebook.com/${post.source}/posts/${cleanPostId}`
  }

  return `https://www.facebook.com/${post.id}`
}

export const buildUserUrl = (userId: string): string => {
  return `https://www.facebook.com/${userId}`
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const downloadMedia = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = filename
    a.click()
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error("Error downloading media:", error)
    throw error
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
