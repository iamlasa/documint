export interface Space {
    id: string;
    spaceId: string;
    name: string;
    accessToken: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    teams?: Array<any>;  // Add this if you need teams relationship
  }