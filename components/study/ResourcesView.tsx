"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Youtube, FileText, Globe } from "lucide-react";
// Assuming Resource type is correctly imported from types
interface Resource {
  url: string;
  title: string;
  source: "youtube" | "google-scholar" | "article" | "general-web";
  type: "video" | "text" | "article";
}

interface ResourcesViewProps {
  resources: Resource[];
}

const sourceIconMap: Record<Resource["source"], React.ReactNode> = {
  youtube: <Youtube className="w-5 h-5 text-red-500 mr-2" />,
  "google-scholar": <FileText className="w-5 h-5 text-blue-500 mr-2" />,
  article: <FileText className="w-5 h-5 text-indigo-500 mr-2" />,
  "general-web": <Globe className="w-5 h-5 text-gray-500 mr-2" />,
};

// --- UTILITY FUNCTION FOR YOUTUBE THUMBNAILS ---
const getYouTubeVideoId = (url: string): string | null => {
  // Regex to extract video ID from common YouTube URL formats
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    // Use 'mqdefault' (medium quality) for a good balance of speed and size
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return null;
};
// ---------------------------------------------

export default function ResourcesView({ resources }: ResourcesViewProps) {
  if (!resources || resources.length === 0) {
    return (
      <Card className="min-h-[40vh] flex items-center justify-center bg-card">
        <CardContent className="text-muted-foreground text-center p-6">
          No external resources were found for this study set.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold text-foreground">
        External Learning Resources
      </h2>
      <p className="text-muted-foreground">
        Deepen your knowledge with recommended videos and articles sourced from
        the web.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {resources.map((res, index) => {
          const isVideo = res.type === "video" && res.source === "youtube";
          const thumbnailUrl = isVideo ? getYouTubeThumbnail(res.url) : null;

          return (
            <Card
              key={index}
              // Changed container to flex for side-by-side layout (thumbnail + text)
              className="group transition-colors border border-border/50 shadow-sm overflow-hidden flex flex-col md:flex-row bg-card hover:bg-muted/50"
            >
              {/* Thumbnail Section (Only for YouTube Videos) */}
              {thumbnailUrl && (
                <div className="md:w-56 w-full h-auto md:h-full flex-shrink-0 relative overflow-hidden bg-background">
                  <img
                    src={thumbnailUrl}
                    alt={`Thumbnail for ${res.title}`}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
                    <Youtube className="w-10 h-10 text-white/80 group-hover:text-white transition-transform duration-300" />
                  </div>
                </div>
              )}

              <div className="flex-1 p-4 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-start justify-between p-0">
                  <div className="flex flex-col space-y-1 w-full">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                      {sourceIconMap[res.source] || (
                        <Globe className="w-5 h-5 mr-2 text-muted-foreground" />
                      )}
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-primary/90 group-hover:text-primary transition-colors line-clamp-2"
                      >
                        {res.title}
                      </a>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground ml-7">
                      Source: {res.source.replace("-", " ").toUpperCase()} •
                      Type: {res.type.toUpperCase()}
                    </p>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors p-2 rounded-full hover:bg-background"
                    aria-label={`Open ${res.title}`}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </CardHeader>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
