
'use client';

import { useState, useEffect, useCallback } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, Cpu, BookOpen, Link as LinkIcon, Users, Rocket, FlaskConical, MapPin, Building, Target, Tag, Satellite, Loader2, SatelliteDish, Orbit, UserSquare2, Sliders, VenetianMask, Weight, Zap, CircleDollarSign, Edit, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SpaceMission } from '@/services/space-missions';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { User } from '@/services/social';
import { cn } from '@/lib/utils';
import { UserListDialog } from '@/components/user-list-dialog';
import { MissionUpdate } from '@/services/updates';
import { ContributeUpdateDialog } from '@/components/contribute-update-dialog';
import MissionUpdateCard from '@/components/mission-update-card';
import { Skeleton } from '@/components/ui/skeleton';


// Function to get status badge variant
const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
   if (!status) return 'outline';
   switch (status.toLowerCase()) {
     case 'active':
     case 'ongoing':
        return 'default';
     case 'completed':
        return 'secondary';
     case 'planned':
     case 'upcoming':
        return 'outline';
     case 'failed':
        return 'destructive';
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
  const [updates, setUpdates] = useState<MissionUpdate[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUpdatesLoading, setIsUpdatesLoading] = useState(true);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);

  const fetchMissionDetails = useCallback(async () => {
    if (!slug) return;
    setIsPageLoading(true);

    try {
      const response = await fetch(`/api/v1/missions/${slug}`);
      if (!response.ok) {
         if (response.status === 404) notFound();
         const errorJson = await response.json();
         throw new Error(errorJson.error || `Failed to fetch mission: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch mission data.');
      
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
  }, [slug, user]);

  const fetchMissionUpdates = useCallback(async () => {
      if (!slug) return;
      setIsUpdatesLoading(true);
      try {
          const response = await fetch(`/api/v1/missions/${slug}/updates`);
          if (!response.ok) throw new Error("Failed to fetch mission updates.");
          const result = await response.json();
          if (result.success) {
              setUpdates(result.data);
          }
      } catch (error: any) {
          toast.error(error.message || "Could not load mission updates.");
      } finally {
          setIsUpdatesLoading(false);
      }
  }, [slug]);

  useEffect(() => {
    fetchMissionDetails();
    fetchMissionUpdates();
  }, [fetchMissionDetails, fetchMissionUpdates]);

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
            
            setIsTracking(prevState => !prevState);

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
            
             updateUser(prevUser => {
                if (!prevUser) return null;
                 const wasTracking = prevUser.trackedMissions?.some(m => m._id === mission._id);
                 let newTrackedMissions;
                 if (wasTracking) {
                     newTrackedMissions = prevUser.trackedMissions?.filter(m => m._id !== mission._id);
                 } else {
                     const missionSummary = { _id: mission._id, slug: mission.slug, missionName: mission.missionName, image: mission.image, missionType: mission.missionType, target: mission.target, agency: mission.agency, launch: mission.launch, status: mission.status, objectives: mission.objectives, technologies: mission.technologies, findings: mission.findings };
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
    missionTimeline,
    spacecraft,
    crew,
    payloads,
    orbitDetails,
    budget,
  } = mission;

  const launchDateFormatted = launch.launchDate ? new Date(launch.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact' }).format(amount);
  }
  
  const visibleTrackers = trackedBy.slice(0, 3);
  const hiddenTrackersCount = trackedBy.length - visibleTrackers.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{missionName}</h1>
            {status && <Badge variant={getStatusVariant(status)} className="text-lg px-4 py-1">{status}</Badge>}
          </div>
           <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-base">
                    {target && <div className="flex items-center"><Target className="mr-1.5 h-4 w-4" /> {target}</div>}
                    {missionType && <div className="flex items-center"><Tag className="mr-1.5 h-4 w-4" /> {missionType}</div>}
                </div>
                <div className="flex items-center gap-4">
                    {trackedBy && trackedBy.length > 0 && (
                        <div className="flex items-center -space-x-2">
                             <TooltipProvider>
                                {visibleTrackers.map((trackingUser, index) => (
                                     <Tooltip key={trackingUser._id}>
                                         <TooltipTrigger asChild>
                                             <Link href={`/profile/${trackingUser.username}`}>
                                                 <Avatar className="h-9 w-9 border-2 border-background">
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
                             </TooltipProvider>

                             {hiddenTrackersCount > 0 && (
                                <UserListDialog
                                    title="Tracked By"
                                    users={trackedBy}
                                    trigger={
                                        <button className="h-9 w-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background hover:bg-primary/10 hover:text-primary">
                                            +{hiddenTrackersCount}
                                        </button>
                                    }
                                />
                             )}
                        </div>
                    )}
                     <Button variant="outline" className="glow-on-hover border-primary/50 hover:bg-primary/10 hover:text-primary" onClick={handleTrackClick} disabled={isToggleLoading || !user}>
                        {isToggleLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isTracking ? (
                            <SatelliteDish className="mr-2 h-4 w-4" />
                        ) : (
                            <Satellite className="mr-2 h-4 w-4" />
                        )}
                        {isTracking ? 'Un-track' : 'Track Mission'}
                    </Button>
                </div>
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
                 {budget?.amount && <DetailItem icon={<CircleDollarSign />} label="Budget" value={formatCurrency(budget.amount, budget.currency || 'USD')} className="justify-center sm:justify-start"/>}
                 {orbitDetails?.orbitType && <DetailItem icon={<Orbit/>} label="Orbit Type" value={orbitDetails.orbitType} className="justify-center sm:justify-start"/>}

            </div>
        </div>

        <Separator />

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-3xl font-bold tracking-tight flex items-center"><Rss className="mr-3 text-primary h-7 w-7" />Mission Updates</h2>
              {user && (
                <Button variant="outline" onClick={() => setIsContributeDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Contribute an Update
                </Button>
              )}
          </div>
          {isUpdatesLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
          ) : updates.length > 0 ? (
             <div className="space-y-4">
                {updates.map(update => (
                    <MissionUpdateCard key={update._id} update={update} />
                ))}
             </div>
          ) : (
             <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card/50">
                <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Updates Yet</h3>
                <p className="text-muted-foreground">Be the first to contribute an update for this mission!</p>
             </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12 pt-6">
            <div className="lg:col-span-2 space-y-10">
                {spacecraft && (
                    <section>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center"><Satellite className="mr-3 text-primary h-7 w-7" />Spacecraft Details</h2>
                        <Card className="bg-card/50">
                            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <DetailItem icon={<VenetianMask/>} label="Name" value={spacecraft.name} />
                                <DetailItem icon={<Tag/>} label="Type" value={spacecraft.type} />
                                <DetailItem icon={<Building/>} label="Manufacturer" value={spacecraft.manufacturer} />
                                {spacecraft.massKg > 0 && <DetailItem icon={<Weight/>} label="Mass" value={`${spacecraft.massKg.toLocaleString()} kg`} />}
                                <DetailItem icon={<Zap/>} label="Power Source" value={spacecraft.powerSource} />
                            </CardContent>
                        </Card>
                    </section>
                )}

                {payloads && payloads.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center"><Sliders className="mr-3 text-primary h-7 w-7" />Payloads</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {payloads.map(payload => (
                                <div key={payload.name} className="p-4 rounded-md bg-card/50 border">
                                    <p className="font-semibold">{payload.name} <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{payload.type}</span></p>
                                    <p className="text-sm text-foreground/80 mt-1">{payload.purpose}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

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

                 {crew?.isCrewed && crew.members && crew.members.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center"><UserSquare2 className="mr-3 text-primary h-7 w-7" />Mission Crew</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {crew.members.map(member => (
                                <Card key={member.name} className="bg-card/50 overflow-hidden text-center transition-all hover:shadow-lg hover:bg-card/80 hover:-translate-y-1">
                                    <CardContent className="p-4">
                                        <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-primary/50">
                                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${member.name}`} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold text-base">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{member.nationality}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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

       <ContributeUpdateDialog
          missionSlug={slug}
          open={isContributeDialogOpen}
          onOpenChange={setIsContributeDialogOpen}
          onUpdateSubmitted={fetchMissionUpdates}
        />
    </div>
  );
}
