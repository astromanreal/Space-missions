import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Instagram, Twitter, Github } from "lucide-react"; // Use Twitter icon, Add Github icon
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm border border-border/50">
        <CardHeader className="text-center pb-4">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary shadow-md">
            {/* Placeholder image, replace with actual if available */}
            <AvatarImage src="https://github.com/shadcn.png" alt="Sarthak Sri" data-ai-hint="profile picture" />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">Sarthak Srivastava</CardTitle>
           <p className="text-muted-foreground">Space Enthusiast & Developer</p>
        </CardHeader>
        <CardContent className="space-y-6 p-6 pt-2">
          <h2 className="text-xl font-semibold text-center mb-6 border-b pb-2 border-border/50">Get in Touch</h2>

          <div className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted/50">
            <Mail className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium">Email</h3>
              <a href="mailto:Astroman6569@gmail.com" className="text-accent hover:underline break-all">
                Astroman6569@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted/50">
            <Phone className="h-6 w-6 text-primary flex-shrink-0" />
             <div>
              <h3 className="font-medium">Phone</h3>
              <a href="tel:+918102116569" className="text-accent hover:underline">
                +91 8102116569
              </a>
             </div>
          </div>

           <div className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted/50">
            <Twitter className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
               <h3 className="font-medium">X (Twitter)</h3>
              <Link href="https://x.com/Sathyamsarthak" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @Sathyamsarthak
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted/50">
            <Instagram className="h-6 w-6 text-primary flex-shrink-0" />
             <div>
              <h3 className="font-medium">Instagram</h3>
              <Link href="https://www.instagram.com/srishikharji/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @srishikharji
              </Link>
             </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted/50">
            <Github className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium">GitHub</h3>
              <Link href="https://github.com/astromanreal" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @astromanreal
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
