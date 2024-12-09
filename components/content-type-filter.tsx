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
import { getSpaces, StoredSpace } from '@/lib/local-storage'
import { useSession } from 'next-auth/react'

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
  const { data: session } = useSession()

  useEffect(() => {
    async function loadContentTypes() {
      if (!session?.user?.id) return;
      
      console.log("Loading content types for space:", spaceId);
      const spaces = getSpaces(session.user.id) as StoredSpace[];
      const space = spaces.find(s => s.id === spaceId)
      if (!space) {
        console.error("Space not found:", spaceId);
        return
      }

      try {
        console.log("Found space:", space.name);
        const client = getContentfulClient(space.accessToken)
        const spaceClient = await getSpace(client, space.spaceId)
        const environment = await getEnvironment(spaceClient)
        const types = await getContentTypes(environment)
        
        console.log("Loaded content types:", types);
        
        const sortedTypes = types.sort((a: ContentType, b: ContentType) => 
          a.name.localeCompare(b.name)
        )
        setContentTypes(sortedTypes)
      } catch (error) {
        console.error('Error loading content types:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContentTypes()
  }, [spaceId, session?.user?.id])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder={isLoading ? "Loading..." : "Filter by content type"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Content Types</SelectLabel>
          <SelectItem value="all">All content types</SelectItem>
          {contentTypes.map((type: ContentType) => (
            <SelectItem 
              key={type.id} 
              value={type.id}
            >
              <div className="flex items-center justify-between w-full">
                <span>{type.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({type.id})
                </span>
              </div>
            </SelectItem>
          ))}
          {contentTypes.length === 0 && !isLoading && (
            <SelectItem value="none" disabled>
              No content types found
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}