import { createClient } from 'contentful-management'

export function getContentfulClient(accessToken: string) {
  return createClient({
    accessToken,
  })
}

export async function getSpace(client: any, spaceId: string) {
  return client.getSpace(spaceId)
}

export async function getEnvironment(space: any, environmentId = 'master') {
  return space.getEnvironment(environmentId)
}

export async function getContentTypes(environment: any) {
  const response = await environment.getContentTypes({ limit: 1000 })
  return response.items.map(type => ({
    id: type.sys.id,
    name: type.name,
    description: type.description,
    displayField: type.displayField,
    fields: type.fields,
  }))
}

export async function getEntries(environment: any, options: { 
  query?: string
  contentType?: string
  limit?: number 
} = {}) {
  const searchParams: any = {
    limit: options.limit || 25,
    order: '-sys.updatedAt',
  }

  if (options.query) {
    searchParams.query = options.query
  }

  if (options.contentType) {
    searchParams.content_type = options.contentType
  }

  return environment.getEntries(searchParams)
}

export function cleanContentfulResponse(entry: any) {
  if (!entry?.sys?.contentType?.sys?.id) {
    return null
  }

  const locales = Object.keys(entry.fields || {})
    .flatMap(field => Object.keys(entry.fields[field]))
    .filter((value, index, self) => self.indexOf(value) === index)

  const locale = locales[0] || 'en-US'

  const content = Object.entries(entry.fields)
    .filter(([_, value]: [string, any]) => 
      typeof value?.[locale] === 'string' && 
      !['title', 'slug', 'url'].includes(_)
    )
    .map(([_, value]: [string, any]) => value[locale])
    .join('\n')
    .trim()

  return {
    id: entry.sys.id,
    contentType: entry.sys.contentType.sys.id,
    title: entry.fields.title?.[locale] || 
           entry.fields.name?.[locale] || 
           'Untitled',
    content: content || 
             entry.fields.description?.[locale] || 
             entry.fields.body?.[locale] || '',
    url: entry.fields.slug?.[locale] || 
         entry.fields.url?.[locale] || '',
    lastUpdated: entry.sys.updatedAt,
    status: entry.sys.publishedVersion ? 'published' : 'draft'
  }
}