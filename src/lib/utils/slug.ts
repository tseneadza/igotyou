import { nanoid } from 'nanoid'

/**
 * Generates a URL-safe slug from a title
 * @param title - The title to convert to a slug
 * @param maxLength - Maximum length of the base slug (default: 50)
 * @returns A unique slug with a random suffix
 */
export function generateSlug(title: string, maxLength: number = 50): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength)
  
  return `${baseSlug}-${nanoid(6)}`
}

/**
 * Generates just the base slug without the random suffix
 * Useful for testing or when you want to add your own suffix
 * @param title - The title to convert to a slug
 * @param maxLength - Maximum length of the slug (default: 50)
 */
export function generateBaseSlug(title: string, maxLength: number = 50): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength)
}
