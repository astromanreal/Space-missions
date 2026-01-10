
'use client';

import { useState } from 'react';
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

interface ContributeUpdateDialogProps {
  missionSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSubmitted: () => void;
}

export function ContributeUpdateDialog({ missionSlug, open, onOpenChange, onUpdateSubmitted }: ContributeUpdateDialogProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in to contribute.");
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading("Submitting your update...");

    try {
      const response = await fetch(`/api/v1/missions/${missionSlug}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Update submitted for review!", { id: loadingToast });
        setTitle('');
        setContent('');
        onOpenChange(false);
        onUpdateSubmitted();
      } else {
        throw new Error(data.error || "Failed to submit update.");
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
            <DialogTitle>Contribute an Update</DialogTitle>
            <DialogDescription>
              Share a new finding, article, or piece of news about this mission. Your submission will be reviewed by an administrator before being published.
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit for Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
