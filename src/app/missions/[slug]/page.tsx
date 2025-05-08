import { getSpaceMissions, SpaceMission } from '@/services/space-missions';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Tag, CheckCircle, Clock, MapPin, Target, Cpu, BookOpen, Link as LinkIcon, Layers, FlaskConical, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MissionDetailPageProps {
  params: {
    slug: string;
  };
}

// Function to get status badge variant (consistent with MissionCard)
const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
   switch (status.toLowerCase()) {
     case 'active': return 'default';
     case 'completed': return 'secondary';
     case 'planned': return 'outline';
     default: return 'outline';
   }
 };

// Generate static paths for known missions if needed for SSG
// export async function generateStaticParams() {
//   const missions = await getSpaceMissions();
//   return missions.map((mission) => ({
//     slug: mission.name.toLowerCase().replace(/\s+/g, '-'),
//   }));
// }


export default async function MissionDetailPage({ params }: MissionDetailPageProps) {
  const missions = await getSpaceMissions();
  const mission = missions.find(
    (m) => m.name.toLowerCase().replace(/\s+/g, '-') === params.slug
  );

  if (!mission) {
    notFound(); // Show 404 if mission not found
  }

  const {
    name,
    launchYear,
    agency,
    missionType,
    status,
    target,
    objectives,
    technologies,
    findings,
    image, // This is now a direct URL
  } = mission;

  const agencyLogoUrl = `https://logo.clearbit.com/${agency.toLowerCase().replace(/ /g, '')}.com`; // Simple logo fetching

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{name}</h1>
            <Badge variant={getStatusVariant(status)} className="text-lg px-4 py-1">{status}</Badge>
          </div>

          <div className="flex items-center space-x-4 text-muted-foreground">
             {/* Agency Logo (simple placeholder) */}
            {/* <Image src={agencyLogoUrl} alt={`${agency} logo`} width={24} height={24} className="rounded" /> */}
            <span>{agency}</span>
             <span className="text-border">|</span>
            <div className="flex items-center"><Calendar className="mr-1.5 h-4 w-4" /> {launchYear}</div>
            <span className="text-border">|</span>
             <div className="flex items-center"><Tag className="mr-1.5 h-4 w-4" /> {missionType}</div>
            <span className="text-border">|</span>
            <div className="flex items-center"><Target className="mr-1.5 h-4 w-4" /> {target}</div>
          </div>
        </header>

        {/* Image Section */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src={image} // Use the direct image URL from mission data
            alt={`Illustration for ${name} mission`}
            layout="fill"
            objectFit="cover"
            priority // Load main image faster
            data-ai-hint={`${target} ${missionType} space landscape`}
          />
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Left Column (Objectives, Technologies) */}
          <div className="md:col-span-2 space-y-6">
             <Section title="Mission Objectives" icon={<BookOpen />}>
              <ul className="list-disc list-inside space-y-2 text-foreground/90">
                {objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </Section>

            <Section title="Key Technologies" icon={<Cpu />}>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="border-accent text-accent bg-accent/10">{tech}</Badge>
                ))}
              </div>
            </Section>

            <Section title="Major Discoveries & Impact" icon={<FlaskConical />}>
               <ul className="list-disc list-inside space-y-2 text-foreground/90">
                {findings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
             </Section>
          </div>

          {/* Right Column (Details Card - Placeholder for more) */}
           <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Mission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                 <DetailItem icon={<Clock />} label="Duration" value={mission.duration || "N/A"} />
                 <DetailItem icon={<Users />} label="Collaboration" value={agency} />
                {/* Add more details like instruments, launch vehicle etc. if available */}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-lg">External Links</CardTitle>
              </CardHeader>
               <CardContent>
                 {mission.externalLinks && mission.externalLinks.length > 0 ? (
                  mission.externalLinks.map(link => (
                    <Button key={link.name} variant="link" asChild className="p-0 text-accent block mb-1">
                       <a href={link.url} target="_blank" rel="noopener noreferrer">
                         {link.name} <LinkIcon className="ml-1.5 h-3 w-3 inline-block" />
                      </a>
                    </Button>
                  ))
                 ) : (
                   <p className="text-sm text-muted-foreground">No external links available.</p>
                 )}
               </CardContent>
             </Card>

             <Card className="bg-card/80 backdrop-blur-sm">
               <CardHeader>
                 <CardTitle className="text-lg">Related Missions</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground">
                   Links to related missions coming soon...
                 </p>
                 {/* Add links to other mission pages */}
               </CardContent>
             </Card>
           </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
           <Link href="/explore">
            <Button variant="outline">
               &larr; Back to Explore
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}

// Helper component for sections
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <span className="mr-2 text-primary">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// Helper component for detail items
function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
   return (
     <div className="flex items-center">
       <span className="mr-2 text-muted-foreground">{icon}</span>
       <span className="font-medium mr-1">{label}:</span>
       <span className="text-foreground/90">{value}</span>
     </div>
   );
 }
