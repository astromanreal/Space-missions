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
    {
      name: 'SOHO (Solar and Heliospheric Observatory)',
      launchYear: 1995,
      agency: 'ESA/NASA',
      missionType: 'Solar Observatory',
      status: 'Active',
      target: 'Sun (L1 Point)',
      objectives: [
        'Study the internal structure of the Sun, its extensive outer atmosphere, and the origin of the solar wind.',
        'Provide continuous, uninterrupted views of the Sun.',
        'Act as an early warning system for intense solar storms heading towards Earth.',
      ],
      technologies: ['Large Angle and Spectrometric Coronagraph (LASCO)', 'Extreme ultraviolet Imaging Telescope (EIT)', 'Michelson Doppler Imager (MDI)'],
      findings: [
        'Discovered thousands of comets ("sungrazers").',
        'Revolutionized space weather forecasting.',
        'Provided a deeper understanding of the Sun\'s structure and dynamics.',
      ],
      image: 'https://i.pinimg.com/736x/b1/d5/43/b1d54342376971936e257b420238e83b.jpg',
      duration: '28+ years (ongoing)',
      externalLinks: [{ name: 'ESA SOHO Mission', url: 'https://www.esa.int/Science_Exploration/Space_Science/SOHO_overview' }]
    },
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
      name: 'Curiosity Rover (MSL)',
      launchYear: 2011,
      agency: 'NASA',
      missionType: 'Rover',
      status: 'Active',
      target: 'Mars (Gale Crater)',
      objectives: [
        'Assess whether Mars ever had an environment able to support small life forms called microbes.',
        'Characterize the climate and geology of Mars.',
        'Prepare for human exploration.'
      ],
      technologies: ['ChemCam (Chemistry and Camera complex)', 'SAM (Sample Analysis at Mars)', 'RAD (Radiation Assessment Detector)', 'Mars Hand Lens Imager (MAHLI)'],
      findings: [
        'Confirmed that ancient Mars had the right chemistry to support living microbes.',
        'Discovered complex organic molecules in ancient mudstone.',
        'Measured seasonal variations in atmospheric methane.'
      ],
      image: 'https://i.pinimg.com/736x/3c/6f/30/3c6f3044a2c56a64b9679198a28f7c97.jpg',
      duration: '12+ years (ongoing)',
      externalLinks: [{ name: 'NASA Curiosity (MSL)', url: 'https://mars.nasa.gov/msl/' }]
    },
     {
      name: 'Mars Orbiter Mission (Mangalyaan)',
      launchYear: 2013,
      agency: 'ISRO',
      missionType: 'Orbiter',
      status: 'Completed',
      target: 'Mars',
      objectives: [
        'Develop technologies required for interplanetary missions.',
        'Explore Mars\' surface features, morphology, mineralogy, and atmosphere.',
        'Demonstrate India\'s capability to reach Martian orbit.'
      ],
      technologies: ['Mars Colour Camera (MCC)', 'Thermal Infrared Imaging Spectrometer (TIS)', 'Methane Sensor for Mars (MSM)'],
      findings: [
        'Successfully entered Mars orbit on its first attempt.',
        'Provided a global view of Mars and studied its atmosphere.',
        'Operated for nearly 8 years, well beyond its planned 6-month mission.'
      ],
      image: 'https://i.pinimg.com/736x/43/d8/59/43d8593638a1435349547d33959c996d.jpg',
      duration: '2014–2022',
      externalLinks: [{ name: 'ISRO Mars Orbiter Mission', url: 'https://www.isro.gov.in/Mars_Orbiter_Mission.html' }]
    },
    {
      name: 'MAVEN',
      launchYear: 2013,
      agency: 'NASA',
      missionType: 'Orbiter',
      status: 'Active',
      target: 'Mars Atmosphere',
      objectives: [
        'Understand how Mars lost most of its atmospheric gas to space over time.',
        'Determine the role of solar wind and radiation in atmospheric loss.',
        'Study the interaction of the solar wind with the Martian upper atmosphere.'
      ],
      technologies: ['Neutral Gas and Ion Mass Spectrometer (NGIMS)', 'Solar Wind Electron Analyzer (SWEA)', 'Magnetometer'],
      findings: [
        'Showed that Mars\' atmosphere was stripped away by solar wind and radiation over billions of years.',
        'Observed atmospheric-stripping effects from solar storms in real time.',
        'Mapped the structure of Mars\' magnetic tail.'
      ],
      image: 'https://i.pinimg.com/736x/6f/a0/0a/6fa00ab8184a4410a562145e12484439.jpg',
      duration: '10+ years (ongoing)',
      externalLinks: [{ name: 'NASA MAVEN', url: 'https://science.nasa.gov/mission/maven/' }]
    },
    {
      name: 'ExoMars Trace Gas Orbiter',
      launchYear: 2016,
      agency: 'ESA/Roscosmos',
      missionType: 'Orbiter',
      status: 'Active',
      target: 'Mars Atmosphere',
      objectives: [
        'Search for evidence of methane and other trace gases that could be signatures of active biological or geological processes.',
        'Map the Martian subsurface to locate water or ice.',
        'Serve as a data relay for surface missions.'
      ],
      technologies: ['NOMAD Spectrometer Suite', 'Atmospheric Chemistry Suite (ACS)', 'FREND (Fine-Resolution Epithermal Neutron Detector)'],
      findings: [
        'Created highly detailed maps of subsurface water ice.',
        'Has not detected methane, suggesting current methane levels are extremely low.',
        'Serves as a primary data relay for NASA\'s Mars rovers.'
      ],
      image: 'https://i.pinimg.com/736x/07/70/8a/07708a28cc1e950858e7a46d140e6988.jpg',
      duration: '8+ years (ongoing)',
      externalLinks: [{ name: 'ESA ExoMars TGO', url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_Trace_Gas_Orbiter' }]
    },
    {
      name: 'STEREO A & B',
      launchYear: 2006,
      agency: 'NASA',
      missionType: 'Solar Observers',
      status: 'Active (STEREO-A)',
      target: 'Sun',
      objectives: [
        'Provide stereoscopic (3D) images of the Sun and solar phenomena.',
        'Study coronal mass ejections (CMEs) and their propagation through the solar system.',
        'Improve space weather forecasting.',
      ],
      technologies: ['Sun Earth Connection Coronal and Heliospheric Investigation (SECCHI)', 'In-situ Measurements of Particles and CME Transients (IMPACT)', 'Plasma and Suprathermal Ion Composition (PLASTIC)'],
      findings: [
        'First mission to provide a 3D view of the Sun.',
        'Tracked CMEs from the Sun to Earth, improving forecast accuracy.',
        'STEREO-B lost contact in 2014, but STEREO-A remains operational.',
      ],
      image: 'https://i.pinimg.com/736x/f6/88/2c/f6882c2317f2252b4d2417743f5451e0.jpg',
      duration: '17+ years (ongoing for STEREO-A)',
      externalLinks: [{ name: 'NASA STEREO Mission', url: 'https://stereo.gsfc.nasa.gov/' }]
    },
    {
      name: 'Aditya-L1',
      launchYear: 2023,
      agency: 'ISRO',
      missionType: 'Solar Observatory',
      status: 'Active',
      target: 'Sun (L1 Point)',
      objectives: [
        'Study the solar corona, chromosphere, and photosphere.',
        'Observe solar emissions, flares, and coronal mass ejections.',
        'Analyze the solar wind and its distribution.',
      ],
      technologies: ['Visible Emission Line Coronagraph (VELC)', 'Solar Ultraviolet Imaging Telescope (SUIT)', 'Aditya Solar wind Particle Experiment (ASPEX)'],
      findings: [],
      image: 'https://i.pinimg.com/736x/ae/a6/b8/aea6b87640c8227e57c6b98e578c772e.jpg',
      duration: 'Planned 5-year mission',
      externalLinks: [{ name: 'ISRO Aditya-L1', url: 'https://www.isro.gov.in/Aditya_L1.html' }]
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
      name: 'Tianwen-1 / Zhurong',
      launchYear: 2020,
      agency: 'CNSA',
      missionType: 'Orbiter & Rover',
      status: 'Active (Orbiter) / Hibernating',
      target: 'Mars',
      objectives: [
        'Achieve orbiting, landing, and roving on Mars in one mission.',
        'Study Martian geology, soil characteristics, and water-ice distribution.',
        'Analyze the Martian atmosphere and climate.'
      ],
      technologies: ['Zhurong Rover', 'Ground-Penetrating Radar', 'Mars Magnetometer', 'High-Resolution Camera'],
      findings: [
        'China became the second nation to successfully operate a rover on Mars.',
        'The Zhurong rover studied surface soil and magnetic fields before entering hibernation.',
        'The orbiter continues to map the Martian surface and atmosphere.'
      ],
      image: 'https://i.pinimg.com/736x/09/b7/c1/09b7c12660d5b91b5c2a13f7c4e3e3b3.jpg',
      duration: '3+ years (ongoing for orbiter)',
      externalLinks: []
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
      name: 'Chandrayaan-3',
      launchYear: 2023,
      agency: 'ISRO',
      missionType: 'Lunar Lander & Rover',
      status: 'Completed',
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
      duration: '~14 Earth days',
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
    {
      name: 'Chandrayaan-1',
      launchYear: 2008,
      agency: 'ISRO',
      missionType: 'Orbiter',
      status: 'Completed',
      target: 'Moon',
      objectives: [
        'Create a high-resolution map of the Moon in visible, near-infrared, and X-ray frequencies.',
        'Search for water ice on the lunar surface, especially in polar regions.',
        'Conduct a chemical and mineralogical mapping of the entire lunar surface.',
      ],
      technologies: ['Terrain Mapping Camera (TMC)', 'Moon Mineralogy Mapper (M3)', 'Miniature Synthetic Aperture Radar (Mini-SAR)'],
      findings: [
        'Confirmed the presence of water molecules on the lunar surface.',
        'Provided evidence of water in the lunar exosphere.',
        'Mapped lunar resources and surface features with high accuracy.',
      ],
      image: 'https://i.pinimg.com/736x/a2/1c/85/a21c85311f953f1d5e34734b41935650.jpg',
      duration: '2008-2009',
      externalLinks: [{ name: 'ISRO Chandrayaan-1', url: 'https://www.isro.gov.in/Chandrayaan1_Details.html' }]
    },
    {
      name: 'Chang’e-3',
      launchYear: 2013,
      agency: 'CNSA',
      missionType: 'Lander & Rover (Yutu-1)',
      status: 'Completed',
      target: 'Moon',
      objectives: [
        'Achieve China\'s first soft landing on the Moon.',
        'Deploy and operate the Yutu-1 rover to explore the landing site.',
        'Study lunar geology and soil composition.',
        'Perform astronomical observations from the lunar surface.',
      ],
      technologies: ['Variable thrust engine for soft landing', 'Yutu-1 Rover', 'Ground-Penetrating Radar', 'Alpha particle X-ray spectrometer'],
      findings: [
        'Successfully landed and deployed the Yutu-1 rover.',
        'Discovered a new type of basaltic rock at the landing site.',
        'Conducted the first radar measurements of the lunar subsurface structure.',
      ],
      image: 'https://i.pinimg.com/736x/c5/4b/f7/c54bf71513689408272b22600244f77c.jpg',
      duration: 'Lander: 2+ years, Rover: 40 days operational',
      externalLinks: []
    },
    {
      name: 'Chang’e-4',
      launchYear: 2018,
      agency: 'CNSA',
      missionType: 'Lander & Rover (Yutu-2)',
      status: 'Active',
      target: 'Moon – Far Side',
      objectives: [
        'Achieve the first-ever soft landing on the far side of the Moon.',
        'Explore the South Pole-Aitken Basin, a massive impact crater.',
        'Conduct low-frequency radio astronomy observations.',
        'Study the geology and composition of the lunar far side.',
      ],
      technologies: ['Queqiao relay satellite', 'Yutu-2 Rover', 'Landing Camera', 'Visible and Near-Infrared Imaging Spectrometer'],
      findings: [
        'First spacecraft to land on the far side of the Moon.',
        'Discovered materials from the lunar mantle ejected by an ancient impact.',
        'Provided unprecedented insights into the geology of the far side.',
        'Yutu-2 became the longest-operating lunar rover.'
      ],
      image: 'https://i.pinimg.com/736x/8c/8c/2a/8c8c2a8f8832c3f81e828d546271c667.jpg',
      duration: '5+ years (ongoing)',
      externalLinks: []
    },
    {
      name: 'Chang’e-5',
      launchYear: 2020,
      agency: 'CNSA',
      missionType: 'Sample Return',
      status: 'Completed',
      target: 'Moon',
      objectives: [
        'Collect lunar rock and soil samples from a previously unexplored region.',
        'Perform an automated rendezvous and docking in lunar orbit.',
        'Return the collected samples to Earth for analysis.',
        'Demonstrate China\'s end-to-end sample return capabilities.',
      ],
      technologies: ['Ascent vehicle', 'Robotic sampling arm and drill', 'Lunar orbit rendezvous and docking system', 'Re-entry capsule'],
      findings: [
        'Successfully returned 1.731 kg of lunar samples to Earth.',
        'The returned samples were the youngest lunar materials ever studied.',
        'Provided new insights into the Moon\'s volcanic history.',
      ],
      image: 'https://i.pinimg.com/736x/e4/c4/f9/e4c4f943534063ee384725350e4b8552.jpg',
      duration: '~23 days',
      externalLinks: []
    },
    {
      name: 'SLIM',
      launchYear: 2023,
      agency: 'JAXA',
      missionType: 'Precision Lander',
      status: 'Completed',
      target: 'Moon',
      objectives: [
        'Demonstrate pinpoint landing technology with an accuracy of under 100 meters.',
        'Test a lightweight spacecraft design for lunar exploration.',
        'Deploy two small rovers to study the landing site.',
        'Analyze olivine rocks to understand lunar mantle composition.',
      ],
      technologies: ['Vision-based navigation', 'Crater detection algorithms', 'Shape-changing rovers (LEV-1 and LEV-2)', 'Multi-band spectral camera'],
      findings: [
        'Achieved a historic pinpoint landing with an accuracy of ~55 meters.',
        'Successfully deployed both small rovers.',
        'Survived the lunar night and re-established communication, exceeding expectations.',
      ],
      image: 'https://i.pinimg.com/736x/7d/51/95/7d51950d2208d132b1c4b9a0bf8314fe.jpg',
      duration: 'Landed in Jan 2024; mission status intermittent',
      externalLinks: [{ name: 'JAXA SLIM Mission', url: 'https://www.jaxa.jp/projects/sas/slim/index.en.html' }]
    },
    {
      name: 'Luna-25',
      launchYear: 2023,
      agency: 'Roscosmos',
      missionType: 'Lander',
      status: 'Failed',
      target: 'Moon',
      objectives: [
        'Achieve a soft landing in the lunar south polar region.',
        'Study the composition of the polar regolith and the plasma and dust exosphere.',
        'Search for water ice and other resources.',
      ],
      technologies: ['Lunar manipulator complex (robotic arm)', 'Neutron and gamma-ray spectrometer', 'Ion and neutral mass-spectrometer'],
      findings: [
        'Spacecraft crashed into the lunar surface during an orbital maneuver before landing.',
        'The mission failure provided data on the challenges of automated orbital adjustments.',
      ],
      image: 'https://i.pinimg.com/736x/3b/b7/2d/3bb72d2425d5d8521a08089454153921.jpg',
      duration: 'Mission lost on August 19, 2023',
      externalLinks: []
    },
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
      name: 'Artemis II',
      launchYear: 2026,
      agency: 'NASA',
      missionType: 'Crewed Lunar Flyby',
      status: 'Planned',
      target: 'Moon',
      objectives: [
        'Conduct the first crewed flight of the Orion spacecraft.',
        'Perform a lunar flyby and return to Earth, testing life support systems.',
        'Validate the spacecraft\'s capabilities for long-duration deep space missions.',
      ],
      technologies: ['Orion spacecraft', 'Space Launch System (SLS) Block 1', 'Life Support Systems', 'Manual flight controls'],
      findings: [],
      image: 'https://i.pinimg.com/736x/6d/8c/9b/6d8c9bc88a5652613c719e7a08b35f63.jpg',
      duration: 'Planned ~10-day mission',
      externalLinks: [{ name: 'NASA Artemis II', url: 'https://www.nasa.gov/mission/artemis-ii/' }]
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
      name: 'ExoMars Rosalind Franklin Rover',
      launchYear: 2028,
      agency: 'ESA',
      missionType: 'Rover',
      status: 'Planned',
      target: 'Mars',
      objectives: [
        'Search for signs of past and present life on Mars.',
        'Drill up to 2 meters below the surface to analyze samples protected from radiation.',
        'Characterize the water and geochemical environment of the subsurface.'
      ],
      technologies: ['Deep Drill System', 'Pasteur Payload (instrument suite)', 'PanCam (Panoramic Camera)'],
      findings: [],
      image: 'https://i.pinimg.com/736x/b2/e0/e9/b2e0e97d33a6964958f0a07e4c34a366.jpg',
      duration: 'Planned surface operations: >211 sols',
      externalLinks: [{ name: 'ESA ExoMars Rover', url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_rover' }]
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
      name: 'Artemis III',
      launchYear: 2028,
      agency: 'NASA',
      missionType: 'Human Landing',
      status: 'Planned',
      target: 'Moon (South Pole)',
      objectives: [
        'Land the first woman and first person of color on the Moon.',
        'Explore the lunar south pole to investigate water ice deposits.',
        'Conduct scientific research on the lunar surface.',
        'Establish a long-term human presence on and around the Moon.',
      ],
      technologies: ['Starship HLS (Human Landing System)', 'Next-generation spacesuits', 'Orion Spacecraft', 'Gateway lunar outpost'],
      findings: [],
      image: 'https://i.pinimg.com/736x/b3/3e/26/b33e2637452d398f8bde486948592c30.jpg',
      duration: 'Planned ~30-day mission',
      externalLinks: [{ name: 'NASA Artemis Program', url: 'https://www.nasa.gov/artemis-program/' }]
    },
    {
      name: 'VERITAS',
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
    },
    {
      name: 'Juno',
      launchYear: 2011,
      agency: 'NASA',
      missionType: 'Orbiter',
      status: 'Active',
      target: 'Jupiter',
      objectives: [
        'Understand Jupiter\'s origin and evolution.',
        'Measure Jupiter\'s composition, gravity field, magnetic field, and polar magnetosphere.',
        'Look for clues about how the planet formed, including whether it has a solid core.'
      ],
      technologies: ['Jovian Auroral Distributions Experiment (JADE)', 'Microwave Radiometer (MWR)', 'JunoCam', 'Gravity Science Instrument'],
      findings: [
        'Measured Jupiter\'s powerful magnetic field to be much stronger and more irregular than expected.',
        'Revealed that Jupiter\'s atmospheric dynamics are complex, with Earth-sized cyclones at the poles.',
        'Provided stunning close-up images of Jupiter\'s turbulent atmosphere.'
      ],
      image: 'https://i.pinimg.com/736x/f9/5b/4b/f95b4b1a4325a7458117769d6c700301.jpg',
      duration: '12+ years (ongoing)',
      externalLinks: [{ name: 'NASA Juno Mission', url: 'https://www.nasa.gov/mission_pages/juno/main/index.html' }]
    },
    {
      name: 'JUICE',
      launchYear: 2023,
      agency: 'ESA',
      missionType: 'Orbiter',
      status: 'Active',
      target: 'Jupiter & Ganymede',
      objectives: [
        'Explore Jupiter\'s complex environment in depth.',
        'Study Jupiter\'s three largest icy moons: Ganymede, Callisto, and Europa.',
        'Become the first spacecraft to orbit a moon other than Earth\'s Moon (Ganymede).',
        'Investigate the potential for habitable environments in the Jovian system.'
      ],
      technologies: ['JANUS camera system', 'MAJIS imaging spectrometer', 'RIME ice-penetrating radar', 'GALA laser altimeter'],
      findings: [], // In transit
      image: 'https://i.pinimg.com/736x/8a/4a/c0/8a4ac0635334d743a1975e5334237d6a.jpg',
      duration: 'Arrival at Jupiter in 2031, mission until 2035',
      externalLinks: [{ name: 'ESA JUICE Mission', url: 'https://www.esa.int/Science_Exploration/Space_Science/Juice' }]
    },
    {
      name: 'New Horizons',
      launchYear: 2006,
      agency: 'NASA',
      missionType: 'Flyby',
      status: 'Active',
      target: 'Pluto & Kuiper Belt',
      objectives: [
        'Perform the first-ever flyby of the Pluto system.',
        'Map the surfaces of Pluto and its largest moon, Charon.',
        'Characterize the geology and atmosphere of Pluto.',
        'Explore at least one Kuiper Belt Object (KBO) after the Pluto flyby.'
      ],
      technologies: ['Long-Range Reconnaissance Imager (LORRI)', 'Ralph (Visible and Infrared Imager/Spectrometer)', 'Alice (Ultraviolet Imaging Spectrometer)'],
      findings: [
        'Revealed Pluto to be a geologically active world with mountains of water ice and vast nitrogen-ice plains.',
        'Discovered a hazy, multi-layered atmosphere around Pluto.',
        'Completed a successful flyby of the KBO Arrokoth in 2019, revealing its unique two-lobed shape.'
      ],
      image: 'https://i.pinimg.com/736x/1c/9a/0d/1c9a0d84877237694115426176395b39.jpg',
      duration: '18+ years (ongoing)',
      externalLinks: [{ name: 'NASA New Horizons', url: 'https://www.nasa.gov/mission_pages/newhorizons/main/index.html' }]
    },
    {
      name: 'Voyager 2',
      launchYear: 1977,
      agency: 'NASA',
      missionType: 'Flyby, Interstellar',
      status: 'Active',
      target: 'Outer Planets & Interstellar Space',
      objectives: [
        'Explore all four gas giant planets: Jupiter, Saturn, Uranus, and Neptune.',
        'Study the moons, rings, and magnetic fields of the outer planets.',
        'Enter and study interstellar space.'
      ],
      technologies: ['Radioisotope Thermoelectric Generator (RTG)', 'Golden Record', 'Imaging Science System', 'Plasma Spectrometer'],
      findings: [
        'The only spacecraft to have visited Uranus and Neptune.',
        'Discovered the Great Dark Spot on Neptune and geysers on Triton.',
        'Found new rings and moons around Uranus and Neptune.',
        'Joined Voyager 1 in interstellar space in 2018.'
      ],
      image: 'https://i.pinimg.com/736x/32/a6/50/32a6503e7a0753e1eb411f92dfb10a9f.jpg',
      duration: '46+ years (ongoing)',
      externalLinks: [{ name: 'NASA Voyager Mission', url: 'https://voyager.jpl.nasa.gov/' }]
    },
    {
      name: 'Pioneer 10',
      launchYear: 1972,
      agency: 'NASA',
      missionType: 'Flyby',
      status: 'Completed',
      target: 'Outer Solar System',
      objectives: [
        'Be the first spacecraft to traverse the asteroid belt.',
        'Perform the first close-up study of Jupiter.',
        'Explore the solar wind and cosmic rays.',
        'Attempt to detect the heliosphere boundary.'
      ],
      technologies: ['Pioneer Plaque', 'Radioisotope Thermoelectric Power', 'Geiger Tube Telescope', 'Imaging Photopolarimeter'],
      findings: [
        'First to fly beyond Mars and through the asteroid belt.',
        'Provided the first close-up images of Jupiter.',
        'Made valuable measurements of Jupiter\'s intense radiation belts.'
      ],
      image: 'https://i.pinimg.com/736x/43/e9/87/43e987f7a77d1100570b201ab6b976f0.jpg',
      duration: 'Contact lost in 2003',
      externalLinks: [{ name: 'NASA Pioneer 10', url: 'https://solarsystem.nasa.gov/missions/pioneer-10/in-depth/' }]
    },
    {
      name: 'Pioneer 11',
      launchYear: 1973,
      agency: 'NASA',
      missionType: 'Flyby',
      status: 'Completed',
      target: 'Saturn & Jupiter',
      objectives: [
        'Follow up on Pioneer 10\'s study of Jupiter.',
        'Be the first spacecraft to perform a close flyby of Saturn.',
        'Study Saturn\'s rings, moons, and magnetic field.'
      ],
      technologies: ['Pioneer Plaque', 'Radioisotope Thermoelectric Power', 'Plasma Analyzer', 'Meteoroid Detector'],
      findings: [
        'First spacecraft to fly by Saturn.',
        'Discovered a new ring (the F-ring) and a new moon of Saturn.',
        'Paved the way for the Voyager missions by testing the path through Saturn\'s ring plane.'
      ],
      image: 'https://i.pinimg.com/736x/35/3e/32/353e32e8549646b9a30263f35c5c0d54.jpg',
      duration: 'Contact lost in 1995',
      externalLinks: [{ name: 'NASA Pioneer 11', url: 'https://solarsystem.nasa.gov/missions/pioneer-11/in-depth/' }]
    },
    {
      name: 'Ulysses',
      launchYear: 1990,
      agency: 'ESA/NASA',
      missionType: 'Flyby',
      status: 'Completed',
      target: 'Solar Polar Measurements',
      objectives: [
        'Study the Sun\'s properties at all solar latitudes, including over the poles.',
        'Investigate the heliospheric magnetic field, solar wind, and cosmic rays.',
        'Use a Jupiter gravity assist to enter a unique polar orbit around the Sun.'
      ],
      technologies: ['Radioisotope Thermoelectric Generator (RTG)', 'Solar Wind Observations Over the Poles of the Sun (SWOOPS)', 'Magnetometer (VHM/FGM)'],
      findings: [
        'First and only spacecraft to study the Sun from a polar orbit.',
        'Discovered that the solar wind is faster over the poles than at the equator during solar minimum.',
        'Provided a three-dimensional view of the heliosphere.'
      ],
      image: 'https://i.pinimg.com/736x/39/3a/0d/393a0d5c4146a86de48a4d46c4f346e9.jpg',
      duration: '1990-2009',
      externalLinks: [{ name: 'ESA Ulysses Mission', url: 'https://www.esa.int/Science_Exploration/Space_Science/Ulysses_overview' }]
    }
  ];
}
