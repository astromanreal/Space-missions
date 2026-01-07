

/**
 * Represents a space mission based on the new API structure.
 */
export interface SpaceMission {
  _id: string;
  /** The name of the mission. */
  missionName: string;
  /** The type of mission. */
  missionType: string;
  /** The agency responsible for the mission. */
  agency: {
    name: string;
    country: string;
    organizationType: string;
  };
  /** Launch details. */
  launch: {
    launchDate: string;
    launchVehicle: string;
    launchSite: string;
  };
  /** The target of the mission (e.g., Mars, Moon, Sun). */
  target: string;
  /** The status of the mission (e.g., Active, Completed, Planned). */
  status: string;
  /** The objectives of the mission. */
  objectives: string[];
  /** The technologies used in the mission. */
  technologies: string[];
  /** The major discoveries or impact of the mission. */
  findings: string[];
  /** The URL or identifier of an image representing the mission. */
  image: string;
  /** Duration or key timeline info (optional). */
  duration?: string;
  /** External links (optional). */
  external_links?: { name: string; url: string }[];
  /** Outcome of the mission (optional). */
  outcome?: {
      success: boolean;
      summary: string;
  }
}

// Determine the base URL for API calls.
// On the server, we need an absolute URL. On the client, relative is fine.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side, so use relative path
    return '';
  }
  // Server-side, so construct absolute URL
  const vc = process.env.NEXT_PUBLIC_VERCEL_URL;
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (vc) return `https://${vc}`;
  return url || 'http://localhost:9002'; // Fallback for local development
};

const API_BASE_URL = `${getBaseUrl()}/api/v1`;

// Cache for missions to avoid repeated API calls
let missionsCache: SpaceMission[] | null = null;

/**
 * Asynchronously retrieves a list of space missions from the API.
 * Uses a simple cache to avoid fetching the data more than once.
 *
 * @returns A promise that resolves to an array of SpaceMission objects.
 */
export async function getSpaceMissions(): Promise<SpaceMission[]> {
  if (missionsCache) {
    return missionsCache;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/missions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch missions: ${response.statusText}`);
    }
    const result = await response.json();
    if (result.success) {
      missionsCache = result.data; // Cache the data
      return result.data;
    } else {
      console.error("API returned an error:", result.msg);
      return [];
    }
  } catch (error) {
    console.error("Error fetching space missions:", error);
    return []; // Return an empty array on error
  }
}

/**
 * Asynchronously retrieves a single space mission by its slug (which is treated as an ID) from the API.
 *
 * @param slug The URL-friendly slug (ID) of the mission.
* @returns A promise that resolves to a SpaceMission object or null if not found.
 */
export async function getSpaceMissionBySlug(slug: string): Promise<SpaceMission | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/missions/${slug}`);
        if (!response.ok) {
            // If the response is not OK (e.g., 404), don't try to parse JSON.
            // Just return null or throw a generic error.
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch mission ${slug}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          return result.data;
        } else {
          return null;
        }
    } catch (error) {
        console.error(`Error fetching mission by slug ${slug}:`, error);
        return null; // Return null on error
    }
}

