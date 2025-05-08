
import {
  Orbit, MoveRight, ArrowDownToLine, Truck, Package, MapPin, Moon, Sun, Target, Telescope, Rocket
} from 'lucide-react';
import type { StaticImport } from "next/dist/shared/lib/get-img-props";


// Define an interface for the mission type data
export interface MissionTypeDetail {
  name: string;
  description: string; // General description for the explore page title
  icon: React.ReactElement;
  imageHint: string;
  imageUrl: string; // Added field for direct image URL
  keyTech: string; // Specific key technologies for the explore-by-type card
  isTargetBased?: boolean; // Flag if the type primarily refers to a destination
}

// Define the mission type details in a central place
export const missionTypeDetails: { [key: string]: MissionTypeDetail } = {
  orbiter: {
    name: 'Orbiter Missions',
    description: 'Missions involving spacecraft orbiting celestial bodies for extended observation.',
    icon: <Orbit />,
    imageHint: 'satellite orbiting planet rings',
    imageUrl: 'https://i.pinimg.com/736x/e2/eb/4c/e2eb4c7b8c7aa3214965e63296f5090a.jpg',
    keyTech: 'Cameras, spectrometers, radar for remote sensing.',
    isTargetBased: false,
  },
  flyby: {
    name: 'Flyby Missions',
    description: 'Missions where spacecraft pass by celestial bodies for quick surveys.',
    icon: <MoveRight />,
    imageHint: 'spacecraft flyby jupiter',
    imageUrl: 'https://i.pinimg.com/736x/7c/83/be/7c83be6d65e02a0f1e5b906c81e76679.jpg',
    keyTech: 'High-res cameras, magnetometers for quick surveys.',
    isTargetBased: false,
  },
  lander: {
    name: 'Lander Missions',
    description: 'Missions that involve landing spacecraft on the surface of celestial bodies.',
    icon: <ArrowDownToLine />,
    imageHint: 'moon lander crater surface',
    imageUrl: 'https://i.pinimg.com/736x/a6/9e/b0/a69eb0d2799390d0aeb08c97aca6e1e8.jpg',
    keyTech: 'Robotic arms, drills, seismometers for surface analysis.',
    isTargetBased: false,
  },
  rover: {
    name: 'Rover Missions',
    description: 'Missions utilizing wheeled vehicles to explore surfaces.',
    icon: <Truck />,
    imageHint: 'mars rover red desert',
    imageUrl: 'https://i.pinimg.com/736x/5a/62/e2/5a62e211c427964a3e30ff30172af493.jpg',
    keyTech: 'Wheels, cameras, drills, labs for mobile exploration.',
    isTargetBased: false,
  },
  'sample-return': {
    name: 'Sample Return Missions',
    description: 'Complex missions designed to collect and return physical samples.',
    icon: <Package />,
    imageHint: 'sample return capsule re-entry',
    imageUrl: 'https://i.pinimg.com/736x/54/be/a2/54bea2319346c9e7c867858204299f0c.jpg',
    keyTech: 'Collection tools, ascent vehicles, return capsules.',
    isTargetBased: false,
  },
  mars: {
    name: 'Mars Missions',
    description: 'Exploring the Red Planet with orbiters, landers, and rovers.',
    icon: <MapPin />,
    imageHint: 'mars canyon landscape Valles Marineris',
    imageUrl: 'https://i.pinimg.com/736x/6e/64/c0/6e64c04a266bbcc858a2dec99b1ed052.jpg',
    keyTech: 'Rovers, orbiters, landers specifically for Mars.',
    isTargetBased: true,
  },
  moon: {
    name: 'Moon Missions',
    description: 'Investigating Earth\'s natural satellite, past, present, and future.',
    icon: <Moon />,
    imageHint: 'lunar surface apollo footprint',
    imageUrl: 'https://i.pinimg.com/736x/ac/e8/e5/ace8e565f95e7b6ba0d05dcffaa9d2de.jpg',
    keyTech: 'Landers, rovers, orbiters exploring Earth\'s satellite.',
    isTargetBased: true,
  },
  solar: {
    name: 'Solar Missions',
    description: 'Studying our Sun up close to understand its behavior and influence.',
    icon: <Sun />,
    imageHint: 'sun corona solar probe',
    imageUrl: 'https://i.pinimg.com/736x/63/14/96/631496bb78675c47deeae0e045403fc3.jpg',
    keyTech: 'Heat shields, particle detectors to study the Sun.',
    isTargetBased: true,
  },
  asteroid: {
    name: 'Asteroid Missions',
    description: 'Investigating small bodies to understand the early solar system.',
    icon: <Target />,
    imageHint: 'asteroid field space rocks',
    imageUrl: 'https://i.pinimg.com/736x/17/e2/c6/17e2c6222c49c1ebb74004771c9004bc.jpg',
    keyTech: 'Impactors, sample collectors for small bodies.',
    isTargetBased: true,
  },
  telescope: {
    name: 'Space Telescope Missions',
    description: 'Observing the universe from space, free from atmospheric distortion.',
    icon: <Telescope />,
    imageHint: 'space telescope nebula stars',
    imageUrl: 'https://i.pinimg.com/736x/da/c3/e0/dac3e04405be2d5cf28d5d2daedd663e.jpg',
    keyTech: 'Mirrors, detectors for observing distant objects.',
    isTargetBased: false,
  },
};

