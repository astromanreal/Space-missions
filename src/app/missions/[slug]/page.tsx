
'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, Cpu, BookOpen, Link as LinkIcon, Users, Rocket, FlaskConical, MapPin, Building, Target, Tag, Satellite, Loader2, SatelliteDish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SpaceMission } from '@/services/space-missions';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { User } from '@/services/social';
import { cn } from '@/lib/utils';


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

// Extend SpaceMission to include the new 'trackedBy' field from the API
interface MissionWithTracking extends SpaceMission {
    trackedBy: User[];
}

export default function MissionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, token, isLoading: isAuthLoading, updateUser } = useAuth();

  const [mission, setMission] = useState<MissionWithTracking | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  useEffect(() => {
    async function fetchMissionDetails() {
      if (!slug) return;
      setIsPageLoading(true);

      try {
        const response = await fetch(`/api/v1/missions/${slug}`);
        if (!response.ok) {
           if (response.status === 404) {
             notFound();
           }
           const errorJson = await response.json();
           throw new Error(errorJson.error || `Failed to fetch mission: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.success) {
           throw new Error(result.error || 'Failed to fetch mission data.');
        }
        
        const fetchedMission = result.data as MissionWithTracking;
        setMission(fetchedMission);

        if (user && fetchedMission.trackedBy) {
          const isUserTracking = fetchedMission.trackedBy.some(tracker => tracker._id === user._id);
          setIsTracking(isUserTracking);
        }

      } catch (error) {
        console.error("Error fetching mission details:", error);
        toast.error("Could not load mission details.");
      } finally {
        setIsPageLoading(false);
      }
    }

    fetchMissionDetails();
  }, [slug, user]);

  const handleTrackClick = async () => {
    if (!token || !mission || !user) {
      toast.error("You must be logged in to track a mission.");
      return;
    }

    setIsToggleLoading(true);

    try {
        const response = await fetch(`/api/v1/missions/${mission._id}/track`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            toast.success(result.message);
            
            // Optimistically update UI
            setIsTracking(prevState => !prevState);

            // Optimistically update the mission's trackedBy list
            setMission(prevMission => {
                if (!prevMission) return null;
                const wasTracking = prevMission.trackedBy.some(u => u._id === user._id);
                if (wasTracking) {
                    return {
                        ...prevMission,
                        trackedBy: prevMission.trackedBy.filter(u => u._id !== user._id)
                    };
                } else {
                    return {
                        ...prevMission,
                        trackedBy: [...prevMission.trackedBy, { _id: user._id, username: user.username, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt }]
                    };
                }
            });
            
            // Also update the global user state for trackedMissions
             updateUser(prevUser => {
                if (!prevUser) return null;
                 const wasTracking = prevUser.trackedMissions?.some(m => m._id === mission._id);
                 let newTrackedMissions;
                 if (wasTracking) {
                     newTrackedMissions = prevUser.trackedMissions?.filter(m => m._id !== mission._id);
                 } else {
                     const missionSummary = { _id: mission._id, missionName: mission.missionName, image: mission.image, missionType: mission.missionType, target: mission.target, agency: mission.agency, launch: mission.launch, status: mission.status, objectives: mission.objectives, technologies: mission.technologies, findings: mission.findings };
                     newTrackedMissions = [...(prevUser.trackedMissions || []), missionSummary];
                 }
                 return { ...prevUser, trackedMissions: newTrackedMissions };
             });

        } else {
            throw new Error(result.error || "Failed to update tracking status.");
        }
    } catch (error: any) {
        toast.error(error.message || "An error occurred.");
    } finally {
        setIsToggleLoading(false);
    }
  };

  if (isPageLoading || isAuthLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!mission) {
    return notFound();
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
    trackedBy,
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
           <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-base">
                    {target && <div className="flex items-center"><Target className="mr-1.5 h-4 w-4" /> {target}</div>}
                    {missionType && <div className="flex items-center"><Tag className="mr-1.5 h-4 w-4" /> {missionType}</div>}
                </div>
                 <Button variant="outline" className="glow-on-hover border-primary/50 hover:bg-primary/10 hover:text-primary" onClick={handleTrackClick} disabled={isToggleLoading || !user}>
                    {isToggleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isTracking ? (
                        <SatelliteDish className="mr-2 h-4 w-4" />
                    ) : (
                        <Satellite className="mr-2 h-4 w-4" />
                    )}
                    {isTracking ? 'Un-track Mission' : 'Track this Mission'}
                </Button>
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
        
         <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
                <DetailItem icon={<Calendar />} label="Launch Date" value={launchDateFormatted} className="justify-center sm:justify-start" />
                <DetailItem icon={<Rocket />} label="Launch Vehicle" value={launch.launchVehicle} className="justify-center sm:justify-start"/>
                <DetailItem icon={<MapPin />} label="Launch Site" value={launch.launchSite} className="justify-center sm:justify-start"/>
                {duration && <DetailItem icon={<Clock />} label="Duration" value={duration} className="justify-center sm:justify-start"/>}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 text-center sm:text-left">
                <DetailItem icon={<Users />} label="Agency" value={agency.name} className="justify-center sm:justify-start"/>
                <DetailItem icon={<Building />} label="Agency Type" value={agency.organizationType} className="justify-center sm:justify-start"/>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12 pt-6">
            <div className="lg:col-span-2 space-y-10">
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

                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            <Users className="mr-3 text-primary" /> Tracked By
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         {trackedBy && trackedBy.length > 0 ? (
                            <TooltipProvider>
                                <div className="flex items-center space-x-2">
                                    {trackedBy.map(trackingUser => (
                                        <Tooltip key={trackingUser._id}>
                                            <TooltipTrigger asChild>
                                                <Link href={`/profile/${trackingUser._id}`}>
                                                    <Avatar>
                                                        <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${trackingUser.username}`} alt={trackingUser.name} />
                                                        <AvatarFallback>{trackingUser.name?.charAt(0) || trackingUser.username?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{trackingUser.name || trackingUser.username}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        ) : (
                            <p className="text-sm text-muted-foreground">Be the first to track this mission!</p>
                        )}
                    </CardContent>
                </Card>

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
