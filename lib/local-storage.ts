export interface Space {
  id: string;
  name: string;
  spaceId: string;
  accessToken: string;
}

const SPACES_KEY = 'documint_spaces';

export function getSpaces(): Space[] {
  if (typeof window === 'undefined') return [];
  const spaces = localStorage.getItem(SPACES_KEY);
  return spaces ? JSON.parse(spaces) : [];
}

export function addSpace(space: Omit<Space, 'id'>): Space {
  const spaces = getSpaces();
  const newSpace = {
    ...space,
    id: crypto.randomUUID(),
  };
  
  spaces.push(newSpace);
  localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
  return newSpace;
}

export function removeSpace(id: string): void {
  const spaces = getSpaces().filter(space => space.id !== id);
  localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
}

export function updateSpace(id: string, updates: Partial<Space>): Space | null {
  const spaces = getSpaces();
  const index = spaces.findIndex(space => space.id === id);
  
  if (index === -1) return null;
  
  const updatedSpace = { ...spaces[index], ...updates };
  spaces[index] = updatedSpace;
  localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
  
  return updatedSpace;
}