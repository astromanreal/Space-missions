
import { getSpaceMissions, SpaceMission } from '@/services/space-missions';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, Cpu, BookOpen, Link as LinkIcon, Users, Rocket, FlaskConical, MapPin, Building, Target, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Pre-build all mission pages at build time for better performance
export async function generateStaticParams() {
  const missions = await getSpaceMissions();
  return missions.map((mission) => ({
    slug: mission._id,
  }));
}

// Function to fetch data for a single mission
async function getMission(slug: string): Promise<SpaceMission | null> {
    const allMissions = await getSpaceMissions();
    const mission = allMissions.find(m => m._id === slug);
    return mission || null;
}


interface MissionDetailPageProps {
  params: {
    slug: string;
  };
}

// Function to get status badge variant
const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
   if (!status) return 'outline';
   switch (status.toLowerCase()) {
     case 'active': return 'default';
     case 'completed': return 'secondary';
     case 'planned': return 'outline';
     default: return 'outline';
   }
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
  className?: string;
}

function DetailItem({ icon, label, value, children, className }: DetailItemProps) {
    if (!value && !children) return null;
    return (
        <div className={cn("flex items-start", className)}>
            <div className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0">{icon}</div>
            <div className="ml-3">
                <p className="font-medium text-sm text-foreground/80">{label}</p>
                {value && <p className="text-base text-foreground">{value}</p>}
                {children}
            </div>
        </div>
    );
}

export default async function MissionDetailPage({ params }: MissionDetailPageProps) {
  const mission = await getMission(params.slug);

  if (!mission) {
    notFound();
  }

  const {
    missionName,
    launch,
    agency,
    missionType,
    status,
    target,
    objectives,
    technologies,
    findings,
    image,
    duration,
    external_links,
    outcome,
  } = mission;

  const launchDateFormatted = launch.launchDate ? new Date(launch.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{missionName}</h1>
            {status && <Badge variant={getStatusVariant(status)} className="text-lg px-4 py-1">{status}</Badge>}
          </div>
           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-base">
            {agency?.name && <div className="flex items-center"><Users className="mr-1.5 h-4 w-4" /> {agency.name}</div>}
            {target && <div className="flex items-center"><Target className="mr-1.5 h-4 w-4" /> {target}</div>}
            {missionType && <div className="flex items-center"><Tag className="mr-1.5 h-4 w-4" /> {missionType}</div>}
          </div>
        </header>

        {image && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={image}
              alt={`Illustration for ${missionName} mission`}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={`${target} ${missionType} space landscape`}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
            <div className="lg:col-span-2 space-y-10">
                
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <DetailItem icon={<Calendar />} label="Launch Date" value={launchDateFormatted} />
                        <DetailItem icon={<Rocket />} label="Launch Vehicle" value={launch.launchVehicle} />
                        <DetailItem icon={<MapPin />} label="Launch Site" value={launch.launchSite} />
                        <DetailItem icon={<Users />} label="Agency" value={agency.name} />
                        <DetailItem icon={<Building />} label="Agency Type" value={agency.organizationType} />
                        {duration && <DetailItem icon={<Clock />} label="Duration" value={duration} />}
                    </div>
                </section>
                
                <Separator />

                 {objectives && objectives.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center"><BookOpen className="mr-3 text-primary h-7 w-7" />Mission Objectives</h2>
                        <ul className="list-disc list-inside space-y-2 text-lg text-foreground/90 pl-2">
                            {objectives.map((obj, index) => (
                            <li key={index}>{obj}</li>
                            ))}
                        </ul>
                    </section>
                 )}

                 {outcome?.summary && (
                    <section>
                       <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center"><CheckCircle className="mr-3 text-primary h-7 w-7" />Mission Outcome</h2>
                       <p className="text-lg text-foreground/90 leading-relaxed">{outcome.summary}</p>
                    </section>
                )}

                 {findings && findings.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center"><FlaskConical className="mr-3 text-primary h-7 w-7" />Major Discoveries</h2>
                        <ul className="list-disc list-inside space-y-2 text-lg text-foreground/90 pl-2">
                            {findings.map((finding, index) => (
                            <li key={index}>{finding}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <aside className="space-y-6">
                 {technologies && technologies.length > 0 && (
                    <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                           <CardTitle className="flex items-center text-xl"><Cpu className="mr-3 text-primary" />Key Technologies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {technologies.map((tech, index) => (
                                <Badge key={index} variant="outline" className="border-accent text-accent bg-accent/10 py-1 px-3 text-sm">{tech}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {external_links && external_links.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">External Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {external_links.map(link => (
                        <Button key={link.name} variant="link" asChild className="p-0 text-accent block mb-1">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.name} <LinkIcon className="ml-1.5 h-3 w-3 inline-block" />
                            </a>
                        </Button>
                    ))}
                    </CardContent>
                </Card>
                )}
            </aside>
        </div>

        <div className="mt-12 text-center">
           <Button variant="outline" asChild>
             <Link href="/explore">
               &larr; Back to Explore
             </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}

    