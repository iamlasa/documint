export interface Space {
  id: string;
  name: string;
  spaceId: string;
  accessToken: string;
  userId?: string;
}

export interface StoredSpace extends Space {
  configuration?: {
    contentTypes: {
      id: string;
      name: string;
      fields: any[];
    }[];
    defaultLocale: string;
    locales: string[];
  };
}

function getSpaceKey(userId: string) {
  return `documint_spaces_${userId}`;
}

export function getSpaces(userId: string): StoredSpace[] {
  if (typeof window === 'undefined') return [];
  const key = getSpaceKey(userId);
  const spaces = localStorage.getItem(key);
  const parsedSpaces = spaces ? JSON.parse(spaces) : [];
  console.log(`Fetched spaces for user ${userId}:`, parsedSpaces);
  return parsedSpaces;
}

export function addSpace(space: Omit<Space, 'id'>, userId: string): StoredSpace {
  const spaces = getSpaces(userId);
  const existingSpace = spaces.find(s => s.spaceId === space.spaceId);
  
  if (existingSpace) {
    throw new Error('Space already exists');
  }

  const newSpace = {
    ...space,
    id: crypto.randomUUID(),
    userId,
  };
  
  spaces.push(newSpace);
  localStorage.setItem(getSpaceKey(userId), JSON.stringify(spaces));
  console.log(`Added space for user ${userId}:`, newSpace);
  return newSpace;
}

export function updateSpace(id: string, updates: Partial<StoredSpace>, userId: string): StoredSpace | null {
  const spaces = getSpaces(userId);
  const index = spaces.findIndex(space => space.id === id);
  
  if (index === -1) return null;
  
  const updatedSpace = { ...spaces[index], ...updates };
  spaces[index] = updatedSpace;
  localStorage.setItem(getSpaceKey(userId), JSON.stringify(spaces));
  
  return updatedSpace;
}