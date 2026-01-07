
/**
 * Represents a user profile in the social context of the app.
 */
export interface UserProfile {
  /** The unique identifier for the user. */
  id: string;
  /** The user's publicly visible name. */
  name: string;
  /** The user's unique username. */
  username: string;
  /** A short biography of the user. */
  bio: string;
  /** The URL for the user's avatar image. */
  avatarUrl: string;
  /** The URL for the user's profile banner image. */
  bannerUrl: string;
  /** The number of users this user is following. */
  followingCount: number;
  /** The number of users following this user. */
  followersCount: number;
  /** A list of space-related interests. */
  interests: string[];
}

// Represents user data returned from the /api/auth/me endpoint
export interface User {
    id: string;
    username: string;
    email: string;
    bio?: string; // Add optional bio field
    createdAt: string;
    updatedAt: string;
}


// --- MOCK DATA ---

const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Astro-Alex',
    username: 'astroalex',
    bio: 'Astronomer, photographer, and lifelong space enthusiast. Following the stars, one mission at a time.',
    avatarUrl: 'https://i.pinimg.com/736x/0a/53/c3/0a53c3bbe2f5b0c2a8d5b8c3f49557c6.jpg',
    bannerUrl: 'https://i.pinimg.com/736x/b8/45/ad/b845ada17bf21c3f8d38c587d09c4ddf.jpg',
    followingCount: 150,
    followersCount: 2500,
    interests: ['astrophotography', 'hubble', 'exoplanets'],
  },
    {
    id: '2',
    name: 'RocketJane',
    username: 'rocketjane',
    bio: 'Aerospace engineer building the next generation of launch vehicles. Big fan of SpaceX and Artemis.',
    avatarUrl: 'https://i.pinimg.com/736x/8e/58/a8/8e58a8f89523a54b4d68370724f783c1.jpg',
    bannerUrl: 'https://i.pinimg.com/736x/90/04/2a/90042a6170b8d986f91e702c88e2d2e4.jpg',
    followingCount: 88,
    followersCount: 12000,
    interests: ['rocket-propulsion', 'artemis-program', 'mars-colonization'],
  },
    {
    id: '3',
    name: 'MarsExplorer',
    username: 'marsexplorer',
    bio: 'Geologist dreaming of Martian landscapes. Following Perseverance and Curiosity daily.',
    avatarUrl: 'https://i.pinimg.com/736x/3c/6f/30/3c6f3044a2c56a64b9679198a28f7c97.jpg',
    bannerUrl: 'https://i.pinimg.com/736x/77/ec/05/77ec0592682432414909d0f1b37a21b3.jpg',
    followingCount: 240,
    followersCount: 5400,
    interests: ['mars-rovers', 'geology', 'jezero-crater'],
  },
   {
    id: '4',
    name: 'CosmicClara',
    username: 'cosmicclara',
    bio: 'Cosmologist studying the early universe with data from JWST and Hubble.',
    avatarUrl: 'https://i.pinimg.com/736x/0c/3a/0d/0c3a0d1b9c1b6b1b4b1b3b1b3b1b3b1b.jpg',
    bannerUrl: 'https://i.pinimg.com/736x/96/67/e2/9667e2c822fb169da63610ea243790b3.jpg',
    followingCount: 50,
    followersCount: 8900,
    interests: ['cosmology', 'jwst', 'dark-matter'],
  },
  {
    id: '5',
    name: 'StarHopper',
    username: 'starhopper',
    bio: 'Amateur astronomer tracking satellites and spotting nebulae from my backyard.',
    avatarUrl: 'https://i.pinimg.com/736x/d6/9a/4d/d69a4d8a2a7f5a6b0c3f5c5b4d4b4b4b.jpg',
    bannerUrl: 'https://i.pinimg.com/736x/af/6b/08/af6b08403d3465e22b86b1ca85338887.jpg',
    followingCount: 300,
    followersCount: 1200,
    interests: ['amateur-astronomy', 'telescopes', 'iss'],
  }
];

// --- MOCK API FUNCTIONS ---

/**
 * Simulates fetching the currently authenticated user's profile.
 * In a real app, this would get the user ID from a session or token.
 * @returns A promise that resolves to the current user's profile.
 */
export async function getMockCurrentUser(): Promise<UserProfile> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  // Return a specific user from our mock data as the "logged in" user.
  return mockUsers[0];
}

/**
 * Simulates fetching a user's profile by their username.
 * @param username The username to look up.
 * @returns A promise that resolves to the user's profile, or undefined if not found.
 */
export async function getMockUserByUsername(username: string): Promise<UserProfile | undefined> {
   await new Promise(resolve => setTimeout(resolve, 50));
   return mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
}

/**
 * Simulates fetching a list of users (e.g., for followers/following lists or search).
 * @param count The number of mock users to return.
 * @returns A promise that resolves to an array of user profiles.
 */
export async function getMockUsers(count: number): Promise<UserProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    // Return a shuffled and sliced list of mock users to simulate different results
    return [...mockUsers].sort(() => 0.5 - Math.random()).slice(0, count);
}
