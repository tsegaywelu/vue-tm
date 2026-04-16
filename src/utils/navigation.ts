import type { Navs } from '@/types/navigation'

/**
 * Matches a template path (e.g., /shipment/$id) against a real path (e.g., /shipment/123)
 */
export function pathMatches(template: string, real_path: string): boolean {
  const template_segments = template.split('/').filter(Boolean)
  const real_segments = real_path.split('/').filter(Boolean)

  if (template_segments.length !== real_segments.length) return false

  return template_segments.every((seg, i) => {
    return seg.startsWith('$') || seg === real_segments[i]
  })
}

/**
 * Determines if a navigation item or any of its children matches the current path
 */
export function isRouteActive(nav: Navs, current_path: string): boolean {
  if (nav.path && pathMatches(nav.path, current_path)) {
    return true
  }
  if (nav.children) {
    return nav.children.some((child) => isRouteActive(child, current_path))
  }
  return false
}
