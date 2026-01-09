
import { User } from "./social";

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
  };
  /** Array of users tracking this mission (optional). */
  trackedBy?: User[];
}

// The external API base URL
const EXTERNAL_API_BASE_URL = 'https://missions-api.vercel.app/api/v1';

// Cache for missions to avoid repeated API calls
let missionsCache: SpaceMission[] | null = null;

/**
 * Asynchronously retrieves a list of space missions from the API.
 * Uses a simple cache to avoid fetching the data more than once.
 * This function ALWAYS fetches from the external API to ensure consistency
 * across server, client, and build-time environments.
 *
 * @returns A promise that resolves to an array of SpaceMission objects.
 */
export async function getSpaceMissions(): Promise<SpaceMission[]> {
  if (missionsCache) {
    return missionsCache;
  }

  const fetchUrl = `${EXTERNAL_API_BASE_URL}/missions`;

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch missions: ${response.statusText}`);
    }
    const result = await response.json();
    if (result.success) {
      missionsCache = result.data;
      return result.data;
    } else {
      console.error("API returned an error:", result.msg);
      return [];
    }
  } catch (error) {
    console.error("Error fetching space missions:", error);
    return [];
  }
}

/**
 * Asynchronously retrieves a single space mission by its slug (ID).
 * This function fetches directly from the specific mission endpoint.
 *
 * @param slug The URL-friendly slug (ID) of the mission.
 * @returns A promise that resolves to a SpaceMission object or null if not found.
 */
export async function getSpaceMissionBySlug(slug: string): Promise<SpaceMission | null> {
    const fetchUrl = `${EXTERNAL_API_BASE_URL}/missions/${slug}`;

    try {
        const response = await fetch(fetchUrl);

        if (!response.ok) {
             // If not found, it's a valid outcome, so we return null.
            if (response.status === 404) {
                console.warn(`Mission with slug "${slug}" not found.`);
                return null;
            }
            // For other errors, we throw.
            throw new Error(`Failed to fetch mission ${slug}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            console.error(`API returned an error for slug ${slug}:`, result.msg);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching space mission by slug "${slug}":`, error);
        return null;
    }
}
