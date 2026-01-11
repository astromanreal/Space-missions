
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { MissionUpdate } from '@/services/updates';

interface EditSubmissionDialogProps {
  update: MissionUpdate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedSubmission: MissionUpdate) => void;
}

export function EditSubmissionDialog({ update, open, onOpenChange, onUpdate }: EditSubmissionDialogProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (update) {
      setTitle(update.title);
      setContent(update.content);
      setReferenceLink(update.referenceLink);
    }
  }, [update]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !update) {
      toast.error("Authentication or data error.");
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading("Saving changes...");

    if (!update.mission || !update.mission.slug) {
        toast.error("Cannot save: Mission data is missing or incomplete.", { id: loadingToast });
        setIsLoading(false);
        onOpenChange(false);
        return;
    }

    try {
      const response = await fetch(`/api/v1/missions/${update.mission.slug}/updates/${update._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, referenceLink }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save changes.');
        } else {
            const textError = await response.text();
            console.error("Non-JSON error response:", textError);
            throw new Error('Received an unexpected response from the server when saving changes.');
        }
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Update saved!", { id: loadingToast });
        onUpdate(data.data);
        onOpenChange(false);
      } else {
        throw new Error(data.error || "Failed to save changes.");
      }
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
            <DialogDescription>
              Modify the details of your contribution for the mission: <span className="font-semibold text-foreground">{update?.mission.missionName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New Water Ice Deposit Found"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the update in detail..."
                disabled={isLoading}
                required
                rows={5}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="referenceLink">Official Reference Link <span className="text-destructive">*</span></Label>
                <Input
                    id="referenceLink"
                    type="url"
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    placeholder="https://www.nasa.gov/mission_pages/..."
                    disabled={isLoading}
                    required
                />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
