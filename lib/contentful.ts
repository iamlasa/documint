import { createClient } from 'contentful-management'

export function getContentfulClient(accessToken: string) {
  return createClient({
    accessToken,
    host: 'api.contentful.com',
    retryOnError: true,
    headers: {
      'Content-Type': 'application/vnd.contentful.management.v1+json'
    }
  })
}

export interface SearchOptions {
  query?: string;
  fields?: string[];
  boost?: {
    [field: string]: number;
  };
  filters?: {
    contentType?: string;
    status?: string;
    updatedAfter?: Date | null;
    updatedBefore?: Date | null;
    tags?: string[];
  };
}

export function buildQuery(options: SearchOptions) {
  if (!options.query) return '';
  
  // Simple full-text search
  return `query=${options.query}`;
}

export async function getEnvironment(space: any, environmentId = 'master') {
  try {
    console.log('Getting environment:', environmentId)
    const environment = await space.getEnvironment(environmentId)
    console.log('Environment retrieved successfully')
    return environment
  } catch (error) {
    console.error('Error getting environment:', error)
    throw error
  }
}

export async function getSpace(client: any, spaceId: string) {
  try {
    console.log('Attempting to get space:', spaceId)
    const space = await client.getSpace(spaceId)
    console.log('Space retrieved successfully:', space.name)
    return space
  } catch (error: any) {
    console.error('Detailed error getting space:', {
      status: error?.response?.status,
      message: error?.message,
      details: error?.details
    })
    
    if (error?.response?.status === 404) {
      throw new Error('Space not found. Please check your Space ID.')
    } else if (error?.response?.status === 401) {
      throw new Error('Invalid access token. Please check your credentials.')
    }
    throw error
  }
}

export async function getContentTypes(environment: any) {
  try {
    const response = await environment.getContentTypes()
    return response.items.map((type: any) => ({
      id: type.sys.id,
      name: type.name,
      description: type.description,
      displayField: type.displayField,
      fields: type.fields,
    }))
  } catch (error) {
    console.error('Error getting content types:', error)
    throw error
  }
}

export async function getEntries(environment: any, options: { 
  query?: string;
  contentType?: string;
  limit?: number;
  skip?: number;
  status?: string;
  order?: string;
  searchOptions?: SearchOptions;
} = {}) {
  const searchParams: any = {
    limit: options.limit || 25,
    skip: options.skip || 0,
    order: options.order || '-sys.updatedAt',
  };
  
  if (options.searchOptions) {
    const query = buildQuery(options.searchOptions);
    if (query) {
      searchParams['query'] = query;
    }
  } else if (options.query) {
    searchParams.query = options.query;
  }

  if (options.contentType) {
    searchParams.content_type = options.contentType;
  }

  async function executeQuery() {
    let retryCount = 0
    const maxRetries = 3
    const baseDelay = 2000

    while (retryCount < maxRetries) {
      try {
        console.log('Making Contentful API request with params:', JSON.stringify(searchParams, null, 2));
        const response = await environment.getEntries(searchParams);
        console.log('Raw Contentful response:', JSON.stringify(response, null, 2));
        return response;
      } catch (error: any) {
        console.error('Detailed error:', error);
        
        if (error?.sys?.id === 'RateLimitExceeded' && retryCount < maxRetries - 1) {
          retryCount++
          const delay = baseDelay * Math.pow(2, retryCount - 1)
          console.log(`Retrying in ${delay}ms... (Attempt ${retryCount} of ${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw error
      }
    }
    throw new Error('Max retries exceeded')
  }

  return executeQuery()
}

export function cleanContentfulResponse(entry: any) {
  if (!entry?.sys?.contentType?.sys?.id) {
    return null
  }

  try {
    const locales = Object.keys(entry.fields || {})
      .flatMap(field => Object.keys(entry.fields[field]))
      .filter((value, index, self) => self.indexOf(value) === index)

    const locale = locales[0] || 'en-US'

    const textFields = ['content', 'description', 'body', 'text']
    const content = Object.entries(entry.fields)
      .filter(([key, value]: [string, any]) => 
        typeof value?.[locale] === 'string' && 
        !['title', 'slug', 'url'].includes(key) &&
        (textFields.includes(key) || value[locale].length > 0)
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
      status: entry.sys.publishedVersion ? 'published' : 'draft',
      spaceId: entry.sys.space?.sys?.id,
      version: entry.sys.version,
      createdAt: entry.sys.createdAt,
    }
  } catch (error) {
    console.error('Error cleaning Contentful response:', error)
    return null
  }
}