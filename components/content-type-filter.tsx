'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getContentfulClient, getSpace, getEnvironment, getContentTypes } from '@/lib/contentful'
import { getSpaces } from '@/lib/local-storage'

interface ContentType {
  id: string
  name: string
  description?: string
}

interface ContentTypeFilterProps {
  spaceId: string
  value: string
  onValueChange: (value: string) => void
}

export function ContentTypeFilter({ spaceId, value, onValueChange }: ContentTypeFilterProps) {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadContentTypes() {
      const spaces = getSpaces()
      const space = spaces.find(s => s.id === spaceId)
      if (!space) return

      try {
        const client = getContentfulClient(space.accessToken)
        const spaceClient = await getSpace(client, space.spaceId)
        const environment = await getEnvironment(spaceClient)
        const types = await getContentTypes(environment)
        
        // Sort content types by name
        const sortedTypes = types.sort((a, b) => a.name.localeCompare(b.name))
        setContentTypes(sortedTypes)
      } catch (error) {
        console.error('Error loading content types:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContentTypes()
  }, [spaceId])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder={isLoading ? "Loading..." : "Filter by content type"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Content Types</SelectLabel>
          <SelectItem value="all">All content types</SelectItem>
          {contentTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
              {type.description && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({type.description})
                </span>
              )}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}