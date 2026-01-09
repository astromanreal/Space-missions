
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Instagram, Twitter, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define an interface for the contact items for easier mapping
interface ContactItemProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  href: string;
  isExternal?: boolean; // To handle target="_blank" for external links
}

const contactItems: ContactItemProps[] = [
    {
        icon: <Mail />,
        label: "Email",
        value: "Astroman6569@gmail.com",
        href: "mailto:Astroman6569@gmail.com"
    },
    {
        icon: <Phone />,
        label: "Phone",
        value: "+91 8102116569",
        href: "tel:+918102116569"
    },
    {
        icon: <Twitter />,
        label: "X (Twitter)",
        value: "@Sathyamsarthak",
        href: "https://x.com/Sathyamsarthak",
        isExternal: true
    },
    {
        icon: <Instagram />,
        label: "Instagram",
        value: "@srishikharji",
        href: "https://www.instagram.com/srishikharji/",
        isExternal: true
    },
    {
        icon: <Github />,
        label: "GitHub",
        value: "@astromanreal",
        href: "https://github.com/astromanreal",
        isExternal: true
    }
];

function ContactLink({ icon, label, value, href, isExternal = false }: ContactItemProps) {
    return (
        <a 
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="group flex items-center justify-between p-4 rounded-lg transition-colors duration-300 hover:bg-muted/50"
        >
            <div className="flex items-center gap-4">
                <div className="text-primary group-hover:text-accent transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium text-foreground/90">{label}</h3>
                    <p className="text-sm text-accent group-hover:underline">{value}</p>
                </div>
            </div>
            <div className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
                &rarr;
            </div>
        </a>
    )
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="overflow-hidden shadow-xl bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="p-6 text-center border-b border-border/50">
          <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src="https://github.com/shadcn.png" alt="Sarthak Srivastava" data-ai-hint="profile picture" />
            <AvatarFallback className="text-3xl">SS</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">Sarthak Srivastava</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">
            Space Enthusiast & Software Developer
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
            {contactItems.map(item => (
                <ContactLink key={item.label} {...item} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
