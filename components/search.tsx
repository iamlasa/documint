'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  Search as SearchIcon, 
  Filter, 
  SlidersHorizontal,
  ListFilter
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import debounce from 'lodash/debounce'
import { getContentfulClient, getSpace, getEnvironment, getEntries, cleanContentfulResponse } from '@/lib/contentful'
import { getSpaces } from '@/lib/local-storage'
import { ContentPreview } from './content-preview'
import { ContentTypeFilter } from './content-type-filter'
import { Pagination } from '@/components/ui/pagination'
interface SearchProps {
  spaceId: string
}

export function Search({ spaceId }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [contentType, setContentType] = useState('all')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'updated',
    searchFields: ['title', 'content'] as string[]
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25,
  })
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length > 0) {
        handleSearch()
      }
    }, 500),
    [contentType, filters]
  )

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setIsLoading(true)

    try {
      const spaces = getSpaces()
      const space = spaces.find(s => s.id === spaceId)
      if (!space) return

      const client = getContentfulClient(space.accessToken)
      const spaceClient = await getSpace(client, space.spaceId)
      const environment = await getEnvironment(spaceClient)
      
      const skip = (pagination.currentPage - 1) * pagination.itemsPerPage

      const entries = await getEntries(environment, {
        query: searchTerm || undefined,
        contentType: contentType !== 'all' ? contentType : undefined,
        limit: pagination.itemsPerPage,
        skip: skip,
        status: filters.status !== 'all' ? filters.status : undefined,
        order: filters.sortBy === 'updated' ? '-sys.updatedAt' : 
               filters.sortBy === 'created' ? '-sys.createdAt' : 
               'fields.title'
      })

      let cleanedEntries = entries.items
        .map(cleanContentfulResponse)
        .filter(Boolean)

      if (filters.status !== 'all') {
        cleanedEntries = cleanedEntries.filter(entry => 
          filters.status === entry.status
        )
      }

      setPagination(prev => ({
        ...prev,
        totalItems: entries.total,
        totalPages: Math.ceil(entries.total / pagination.itemsPerPage)
      }))

      setResults(cleanedEntries)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    handleSearch()
  }, [spaceId, contentType, filters, pagination.currentPage])

  useEffect(() => {
    debouncedSearch(searchTerm)
    return () => debouncedSearch.cancel()
  }, [searchTerm, debouncedSearch])
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <form onSubmit={handleSearch} className="relative flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <Button type="submit" className="h-11" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </form>
        </div>
        <div className="flex gap-2">
          <ContentTypeFilter
            spaceId={spaceId}
            value={contentType}
            onValueChange={setContentType}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
              >
                <ListFilter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Sort by</h4>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: any) => 
                      setFilters(prev => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Last updated</SelectItem>
                      <SelectItem value="created">Created date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {results.map((entry) => (
            <Card
              key={entry.id}
              className="group relative overflow-hidden transition-all hover:shadow-md cursor-pointer"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{entry.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className="shrink-0 capitalize"
                  >
                    {entry.contentType}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Updated {new Date(entry.lastUpdated).toLocaleDateString()}</span>
                  <span>•</span>
                  <Badge variant={entry.status === 'published' ? 'default' : 'secondary'}>
                    {entry.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}

          {results.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">No results found</p>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? 'Try adjusting your search or filters' : 'Enter a search term to find content'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">Searching content...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {selectedEntry && (
        <ContentPreview
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  )
}