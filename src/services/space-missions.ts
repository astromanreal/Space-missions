/**
 * Represents a space mission.
 */
export interface SpaceMission {
  /** The name of the mission. */
  name: string;
  /** The launch year of the mission. */
  launchYear: number;
  /** The agency responsible for the mission. */
  agency: string;
  /** The type of mission. */
  missionType: string;
  /** The status of the mission (e.g., Active, Completed, Planned). */
  status: string;
  /** The target of the mission (e.g., Mars, Moon, Sun). */
  target: string;
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
  externalLinks?: { name: string; url: string }[];
}

/**
 * Asynchronously retrieves a list of space missions.
 *
 * @returns A promise that resolves to an array of SpaceMission objects.
 * NOTE: This is mock data. In a real app, fetch this from a database or API.
 */
export async function getSpaceMissions(): Promise<SpaceMission[]> {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 50));

  return [
    {
      name: 'Voyager 1',
      launchYear: 1977,
      agency: 'NASA',
      missionType: 'Flyby, Interstellar',
      status: 'Active',
      target: 'Outer Solar System & Interstellar Space',
      objectives: [
        'Explore Jupiter and Saturn.',
        'Study the outer reaches of the solar system.',
        'Become the first human-made object to enter interstellar space.',
        'Transmit data about the interstellar medium.',
      ],
      technologies: ['Radioisotope Thermoelectric Generator (RTG)', 'Golden Record', 'Plasma Wave System', 'Magnetometer'],
      findings: [
        'Detailed images of Jupiter and Saturn, including rings and moons.',
        'Discovery of volcanic activity on Jupiter\'s moon Io.',
        'First spacecraft to cross the heliopause into interstellar space.',
        'Measurements of the interstellar magnetic field and plasma.',
      ],
      image: 'https://i.pinimg.com/736x/59/aa/f9/59aaf9afcf13612cdc2b28c7c3efbca5.jpg',
      duration: '46+ years (ongoing)',
      externalLinks: [{ name: 'NASA Voyager Mission', url: 'https://voyager.jpl.nasa.gov/' }]
    },

    {
      name: 'Cassini–Huygens',
      launchYear: 1997,
      agency: 'NASA/ESA/ASI',
      missionType: 'Orbiter/Lander',
      status: 'Completed',
      target: 'Saturn & Titan',
      objectives: [
        'Study Saturn’s rings, atmosphere, and magnetosphere.',
        'Investigate Titan’s atmosphere and surface with the Huygens probe.',
        'Explore Saturn’s moons, including Enceladus and its geysers.',
        'Understand the evolution of gas giant systems.'
      ],
      technologies: ['High-Gain Antenna', 'Synthetic Aperture Radar', 'Cosmic Dust Analyzer', 'Huygens Descent Imager'],
      findings: [
        'Discovered liquid methane lakes on Titan.',
        'Found active water-ice plumes on Enceladus.',
        'Captured detailed images of Saturn’s rings and moons.',
        'Ended with a controlled descent into Saturn in 2017.'
      ],
      image: 'https://i.pinimg.com/736x/b1/57/57/b1575727d800689384d88c49fbe3edbf.jpg',
      duration: '20 years (1997–2017)',
      externalLinks: [{ name: 'NASA Cassini', url: 'https://saturn.jpl.nasa.gov/' }]
    },
    {
      name: 'Spirit Rover (MER-A)',
      launchYear: 2003,
      agency: 'NASA',
      missionType: 'Mars Rover',
      status: 'Completed',
      target: 'Mars (Gusev Crater)',
      objectives: [
        'Search for signs of past water activity on Mars.',
        'Analyze rocks and soil for composition and mineralogy.',
        'Explore Martian terrain and geology over extended periods.',
        'Test long-duration robotic surface operations.'
      ],
      technologies: ['Panoramic Camera (Pancam)', 'Mini-TES Spectrometer', 'Rock Abrasion Tool (RAT)', 'Solar Panels'],
      findings: [
        'Found evidence of past liquid water in rock formations.',
        'Studied volcanic, sedimentary, and aqueous geological features.',
        'Operated for over 6 years, far beyond its 90-day mission.'
      ],
      image: 'https://i.pinimg.com/736x/a3/7a/a6/a37aa6fcecd1b4f5e86b4ce38e56072d.jpg',
      duration: '2004–2010',
      externalLinks: [{ name: 'NASA Spirit Rover', url: 'https://mars.nasa.gov/mer/mission/rover-status/spirit/' }]
    },
    {
      name: 'Kepler Space Telescope',
      launchYear: 2009,
      agency: 'NASA',
      missionType: 'Space Telescope (Exoplanet Discovery)',
      status: 'Completed',
      target: 'Milky Way (Cygnus-Lyra region)',
      objectives: [
        'Search for Earth-sized exoplanets in habitable zones.',
        'Determine the frequency of potentially habitable planets.',
        'Monitor brightness of 150,000 stars to detect transits.',
        'Support understanding of planetary system formation.'
      ],
      technologies: ['Photometer', 'CCD Sensor Array', 'Reaction Wheels', 'Sunshade'],
      findings: [
        'Discovered over 2,600 confirmed exoplanets.',
        'Revealed that Earth-sized planets are common in the galaxy.',
        'Identified planets in multi-planet systems and around binary stars.'
      ],
      image: 'https://i.pinimg.com/736x/83/c4/7c/83c47ce9d3310ed57bad162919c1bf1c.jpg',
      duration: '2009–2018',
      externalLinks: [{ name: 'NASA Kepler', url: 'https://www.nasa.gov/mission_pages/kepler/' }]
    },
    {
      name: 'Galileo Orbiter',
      launchYear: 1989,
      agency: 'NASA',
      missionType: 'Orbiter (Jupiter System)',
      status: 'Completed',
      target: 'Jupiter & Moons',
      objectives: [
        'Study Jupiter’s atmosphere, magnetosphere, and ring system.',
        'Examine major moons, especially Europa, Io, Ganymede, and Callisto.',
        'Deploy an atmospheric entry probe into Jupiter.',
        'Analyze potential subsurface oceans.'
      ],
      technologies: ['Imaging System', 'Near-Infrared Mapping Spectrometer', 'Atmospheric Probe', 'Dust Detector Subsystem'],
      findings: [
        'Strong evidence for subsurface ocean on Europa.',
        'Observed volcanic activity on Io.',
        'Measured composition and dynamics of Jupiter’s atmosphere.',
        'Dropped probe into Jupiter’s atmosphere in 1995.'
      ],
      image: 'https://i.pinimg.com/736x/dd/0a/46/dd0a46cd1041b183edfd525f065af3cf.jpg',
      duration: '1989–2003',
      externalLinks: [{ name: 'NASA Galileo', url: 'https://solarsystem.nasa.gov/missions/galileo/overview/' }]
    },

    // activemissions
    {
      name: 'Lunar Reconnaissance Orbiter (LRO)',
      launchYear: 2009,
      agency: 'NASA',
      missionType: 'Lunar Orbiter',
      status: 'Active',
      target: 'Moon',
      objectives: [
        'Map the Moon’s surface in high resolution.',
        'Identify safe landing sites for future missions.',
        'Locate potential resources like water ice.',
        'Study the radiation environment in lunar orbit.'
      ],
      technologies: ['LROC Camera', 'Diviner Radiometer', 'Mini-RF Radar', 'LAMP Spectrometer'],
      findings: [
        'Created the most detailed global map of the Moon.',
        'Discovered evidence of water ice in permanently shadowed craters.',
        'Mapped lunar surface temperature variations.',
      ],
      image: 'https://i.pinimg.com/736x/b8/b6/47/b8b647675daf67828439cd1588225a67.jpg',
      duration: '15+ years (ongoing)',
      externalLinks: [{ name: 'NASA LRO', url: 'https://www.nasa.gov/mission_pages/LRO/main/index.html' }]
    },
    {
      name: 'Solar Orbiter',
      launchYear: 2020,
      agency: 'ESA/NASA',
      missionType: 'Solar Observation',
      status: 'Active',
      target: 'Sun (inner heliosphere)',
      objectives: [
        'Study the Sun’s poles and magnetic field.',
        'Investigate the origin of the solar wind.',
        'Understand how solar activity affects the solar system.',
        'Provide complementary data with Parker Solar Probe.'
      ],
      technologies: ['Extreme Ultraviolet Imager (EUI)', 'Polarimetric and Helioseismic Imager (PHI)', 'SPICE Spectrometer', 'Solar Wind Analyzer'],
      findings: [
        'Captured the closest images ever taken of the Sun’s surface.',
        'Observed miniature solar eruptions called "campfires".',
        'Improved understanding of solar wind sources and dynamics.'
      ],
      image: 'https://i.pinimg.com/736x/63/14/96/631496bb78675c47deeae0e045403fc3.jpg',
      duration: 'Expected 7+ years (ongoing)',
      externalLinks: [{ name: 'ESA Solar Orbiter', url: 'https://www.esa.int/Science_Exploration/Space_Science/Solar_Orbiter' }]
    },
    {
      name: 'Lucy',
      launchYear: 2021,
      agency: 'NASA',
      missionType: 'Flyby (Trojan Asteroids)',
      status: 'Active',
      target: 'Jupiter Trojan Asteroids',
      objectives: [
        'Explore multiple Trojan asteroids to learn about the early solar system.',
        'Understand diversity in asteroid composition and geology.',
        'Investigate the origin and evolution of planetesimals.'
      ],
      technologies: ['L’LORRI Camera', 'Thermal Emission Spectrometer (L’TES)', 'Infrared Spectrometer (L’Ralph)'],
      findings: [],
      image: 'https://i.pinimg.com/736x/19/e2/e9/19e2e93458f6a86b9b4b20154fa78a47.jpg',
      duration: '12-year mission (2021–2033)',
      externalLinks: [{ name: 'NASA Lucy Mission', url: 'https://www.nasa.gov/mission_pages/lucy/index.html' }]
    },
    {
      name: 'Chandrayaan-3 Vikram Lander & Pragyan Rover',
      launchYear: 2023,
      agency: 'ISRO',
      missionType: 'Lunar Lander and Rover',
      status: 'Active (Lander in dormant state, rover retired)',
      target: 'Moon (South Pole region)',
      objectives: [
        'Demonstrate safe and soft lunar landing capabilities.',
        'Study lunar surface soil composition and temperature.',
        'Perform in-situ analysis of lunar elements and terrain.',
        'Confirm presence of sulfur and other elements near lunar south pole.'
      ],
      technologies: ['Laser Doppler Velocimeter', 'ChaSTE Probe', 'LIBS and APXS spectrometers', 'NavCams'],
      findings: [
        'First successful soft landing near lunar south pole.',
        'Confirmed presence of sulfur and other elements in the soil.',
        'Collected temperature profile of lunar topsoil.'
      ],
      image: 'https://i.pinimg.com/736x/a7/0c/a7/a70ca7529c6cd71630e8416fbc3e5063.jpg',
      duration: 'Mission lifetime: ~14 days (lander remains dormant)',
      externalLinks: [{ name: 'ISRO Chandrayaan-3', url: 'https://www.isro.gov.in/Chandrayaan3.html' }]
    },


    {
      name: 'Hubble Space Telescope',
      launchYear: 1990,
      agency: 'NASA/ESA',
      missionType: 'Telescope/Observation',
      status: 'Active',
      target: 'Deep Space, Universe',
      objectives: [
        'Observe the universe in visible, ultraviolet, and near-infrared light.',
        'Determine the rate of expansion of the universe.',
        'Study the formation and evolution of galaxies.',
        'Characterize atmospheres of exoplanets.',
      ],
      technologies: ['Corrective Optics (COSTAR)', 'Wide Field Camera 3', 'Advanced Camera for Surveys', 'Gyroscopes'],
      findings: [
        'Provided evidence for the accelerating expansion of the universe.',
        'Helped determine the age of the universe (~13.8 billion years).',
        'Captured iconic images like the Pillars of Creation.',
        'Observed atmospheres of planets outside our solar system.',
      ],
      image: 'https://i.pinimg.com/736x/af/6b/08/af6b08403d3465e22b86b1ca85338887.jpg',
      duration: '34+ years (ongoing)',
       externalLinks: [{ name: 'NASA Hubble Site', url: 'https://science.nasa.gov/mission/hubble/' }]
    },
    {
      name: 'Mars Perseverance Rover',
      launchYear: 2020,
      agency: 'NASA',
      missionType: 'Rover, Sample Caching',
      status: 'Active',
      target: 'Mars (Jezero Crater)',
      objectives: [
        'Seek signs of ancient life and collect samples of rock and soil.',
        'Cache samples on the surface for potential future return missions.',
        'Demonstrate technologies for future human exploration of Mars (e.g., MOXIE oxygen production).',
        'Deploy the Ingenuity helicopter drone.',
      ],
      technologies: ['Sample Caching System', 'MOXIE (Oxygen generation)', 'Ingenuity Helicopter', 'SHERLOC & PIXL instruments', 'Terrain-Relative Navigation'],
      findings: [
        'Successfully collected and cached multiple rock core samples.',
        'Demonstrated powered, controlled flight on another planet with Ingenuity.',
        'Identified organic molecules in Martian rocks.',
        'Characterized the geology and past water activity in Jezero Crater.',
      ],
      image: 'https://i.pinimg.com/736x/77/ec/05/77ec0592682432414909d0f1b37a21b3.jpg',
      duration: '3+ years (ongoing)',
       externalLinks: [{ name: 'NASA Mars Perseverance', url: 'https://mars.nasa.gov/mars2020/' }]
    },
     {
      name: 'James Webb Space Telescope',
      launchYear: 2021,
      agency: 'NASA/ESA/CSA',
      missionType: 'Telescope/Observation',
      status: 'Active',
      target: 'Deep Space (L2 Point)',
      objectives: [
        'Observe the first galaxies formed in the early universe.',
        'Study the formation of stars and planetary systems.',
        'Characterize exoplanets, including their atmospheres.',
        'Look deeper into the universe than ever before in infrared light.',
      ],
      technologies: ['Large segmented mirror (6.5m)', 'Sunshield', 'Infrared detectors (NIRCam, MIRI)', 'Cryocooler'],
      findings: [
        'Captured stunningly detailed images of nebulae and galaxies.',
        'Detected the chemical composition of exoplanet atmospheres with unprecedented detail.',
        'Observed some of the most distant galaxies ever seen.',
        'Provided new insights into star formation regions.',
      ],
      image: 'https://i.pinimg.com/736x/96/67/e2/9667e2c822fb169da63610ea243790b3.jpg',
      duration: '2+ years (ongoing)',
       externalLinks: [{ name: 'NASA Webb Telescope', url: 'https://science.nasa.gov/mission/webb/' }]
    },
     {
      name: 'Artemis I',
      launchYear: 2022,
      agency: 'NASA',
      missionType: 'Lunar Flyby, Test Flight',
      status: 'Completed',
      target: 'Moon',
      objectives: [
        'Test the Space Launch System (SLS) rocket and Orion spacecraft.',
        'Demonstrate Orion\'s systems in a spaceflight environment.',
        'Perform an uncrewed lunar flyby and return to Earth.',
        'Certify the spacecraft and systems for future crewed missions.',
      ],
      technologies: ['Space Launch System (SLS)', 'Orion spacecraft', 'European Service Module', 'Heat Shield'],
      findings: [
        'Successful launch and operation of the SLS rocket.',
        'Successful demonstration of Orion spacecraft systems, including lunar flyby and high-speed reentry.',
        'Gathered valuable data on spacecraft performance and the deep space environment.',
      ],
      image: 'https://i.pinimg.com/736x/90/04/2a/90042a6170b8d986f91e702c88e2d2e4.jpg',
      duration: '~25 days',
       externalLinks: [{ name: 'NASA Artemis I', url: 'https://www.nasa.gov/artemis-1/' }]
    },
    {
      name: 'Parker Solar Probe',
      launchYear: 2018,
      agency: 'NASA',
      missionType: 'Solar Orbiter/Flyby',
      status: 'Active',
      target: 'Sun (Corona)',
      objectives: [
        'Trace the flow of energy that heats and accelerates the solar corona and solar wind.',
        'Determine the structure and dynamics of the plasma and magnetic fields at the sources of the solar wind.',
        'Explore mechanisms that accelerate and transport energetic particles.',
      ],
      technologies: ['Thermal Protection System (Heat Shield)', 'Solar Probe Cup', 'FIELDS instrument suite', 'WISPR imager'],
      findings: [
        'First spacecraft to "touch" the Sun by flying through its corona.',
        'Discovered switchbacks (magnetic zig-zag structures) in the solar wind.',
        'Provided unprecedented data on the near-Sun environment.',
      ],
      image: 'https://i.pinimg.com/736x/8b/09/28/8b0928b1d6364cec27628c2b19edf6bd.jpg',
      duration: '5+ years (ongoing)',
       externalLinks: [{ name: 'NASA Parker Solar Probe', url: 'https://science.nasa.gov/mission/parker-solar-probe/' }]
    },
    // Add a planned mission example
     {
      name: 'Europa Clipper',
      launchYear: 2024, // Planned
      agency: 'NASA',
      missionType: 'Jupiter Orbiter / Europa Flyby',
      status: 'Planned',
      target: 'Jupiter / Europa (Moon)',
      objectives: [
        'Determine the thickness of Europa\'s icy shell and search for subsurface water.',
        'Investigate the composition and geology of Europa.',
        'Search for potential plumes erupting from the surface.',
        'Characterize the moon\'s ocean and potential habitability.',
      ],
      technologies: ['Ice-Penetrating Radar', 'Magnetometer', 'Thermal Emission Imaging System', 'Mass Spectrometer'],
      findings: [], // None yet
      image: 'https://i.pinimg.com/736x/b8/45/ad/b845ada17bf21c3f8d38c587d09c4ddf.jpg',
      duration: 'Expected arrival at Jupiter ~2030',
       externalLinks: [{ name: 'NASA Europa Clipper', url: 'https://europa.nasa.gov/' }]
    },
    {
      name: 'Dragonfly',
      launchYear: 2028, // Planned
      agency: 'NASA',
      missionType: 'Rotorcraft Lander',
      status: 'Planned',
      target: 'Titan (Moon of Saturn)',
      objectives: [
        'Explore Titan’s surface and atmosphere using a drone.',
        'Study prebiotic chemistry and potential habitability.',
        'Investigate the composition of surface materials and subsurface ocean indicators.',
        'Examine atmospheric and surface processes influencing the organic-rich environment.'
      ],
      technologies: ['Dual-quadrotor lander', 'Mass Spectrometer', 'Gamma-ray and Neutron Spectrometer', 'Drill and Sample Handling System'],
      findings: [], // None yet
      image: 'https://i.pinimg.com/736x/48/6d/0b/486d0b6b0c4f68302075591890e23fc6.jpg',
      duration: 'Expected mission duration: ~3 years on Titan surface',
      externalLinks: [{ name: 'NASA Dragonfly', url: 'https://dragonfly.jhuapl.edu/' }]
    },
    {
      name: 'Mars Sample Return',
      launchYear: 2027, // Planned
      agency: 'NASA/ESA',
      missionType: 'Sample Return',
      status: 'Planned',
      target: 'Mars',
      objectives: [
        'Retrieve cached rock and soil samples collected by the Perseverance rover.',
        'Launch samples from the Martian surface using a Mars Ascent Vehicle.',
        'Return the samples to Earth for detailed laboratory analysis.',
        'Advance planetary protection and sample handling protocols.'
      ],
      technologies: ['Sample Retrieval Lander', 'Mars Ascent Vehicle (MAV)', 'ESA Earth Return Orbiter', 'Capture & Containment System'],
      findings: [], // None yet
      image: 'https://i.pinimg.com/736x/38/cf/a8/38cfa863c6d1adf3cb0fb9cebc9a0527.jpg',
      duration: 'Estimated full mission cycle: ~10 years',
      externalLinks: [{ name: 'NASA Mars Sample Return', url: 'https://mars.nasa.gov/msr/' }]
    },
    {
      name: 'VERITAS (Venus Emissivity, Radio Science, InSAR, Topography, and Spectroscopy)',
      launchYear: 2031, // Planned
      agency: 'NASA',
      missionType: 'Orbiter',
      status: 'Planned',
      target: 'Venus',
      objectives: [
        'Map Venus’s surface with high-resolution radar imaging.',
        'Study Venus’s geologic history and surface composition.',
        'Search for signs of recent volcanic and tectonic activity.',
        'Compare Venus’s evolution with Earth’s to understand planetary divergence.'
      ],
      technologies: ['Synthetic Aperture Radar (SAR)', 'Near-Infrared Spectrometer', 'Gravity Science Experiment'],
      findings: [], // None yet
      image: 'https://i.pinimg.com/736x/ef/d6/b2/efd6b21a9a532191d567ed922a3c124b.jpg',
      duration: 'Planned mission: ~2 Venus days (243 Earth days)',
      externalLinks: [{ name: 'NASA VERITAS', url: 'https://www.jpl.nasa.gov/missions/veritas' }]
    }
  ];
}
