import defaultSettings from '@/settings'

const title = defaultSettings.title || '216鞋吧'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
