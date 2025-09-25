// Simple mock Prisma client for development without network access
type UserCreateInput = {
  name: string;
  email: string;
  password: string;
  accountType: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
  website?: string;
};

type UserSelect = {
  id?: boolean;
  name?: boolean;
  email?: boolean;
  accountType?: boolean;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  image: string | null;
};

export const prisma = {
  user: {
    findUnique: async (): Promise<User | null> => {
      // Mock implementation - returns null for now (user not found)
      return null;
    },
    create: async ({ data, select }: { 
      data: UserCreateInput;
      select?: UserSelect;
    }) => {
      // Mock implementation - returns the data with an id
      const result = {
        id: 'mock-id-' + Date.now(),
        ...data,
      };
      
      // Return only selected fields if select is specified
      if (select) {
        const filtered: Record<string, unknown> = {};
        Object.keys(select).forEach(key => {
          if (select[key as keyof UserSelect]) {
            filtered[key] = result[key as keyof typeof result];
          }
        });
        return filtered;
      }
      
      return result;
    }
  }
};