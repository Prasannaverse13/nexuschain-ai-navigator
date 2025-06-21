import { ExternalLink } from 'lucide-react';

const resources = {
  "Agent Development Kit (ADK)": [
    { name: "Get Started", href: "https://google.github.io/adk-docs/get-started/" },
    { name: "Python SDK (GitHub)", href: "https://github.com/google/adk-python" },
    { name: "Contributing Guide", href: "https://google.github.io/adk-docs/contributing-guide/" },
  ],
  "Google Cloud AI": [
    { name: "Agent Builder", href: "https://cloud.google.com/products/agent-builder" },
    { name: "Vertex AI Agent Engine", href: "https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview" },
    { name: "Google AI Models", href: "https://ai.google/get-started/our-models/" },
  ],
  "Samples & Community": [
    { name: "ADK Samples (GitHub)", href: "https://github.com/google/adk-samples" },
    { name: "ADK DevOps Starter Pack", href: "https://github.com/GoogleCloudPlatform/agent-starter-pack" },
    { name: "ADK on YouTube", href: "https://www.youtube.com/@GoogleDevelopers/search?query=adk&themeRefresh=1" },
    { name: "Start in IDX", href: "https://studio.firebase.google.com/new?template=https%3A%2F%2Fgithub.com%2FGoogleCloudPlatform%2Fagent-starter-pack%2Ftree%2Fmain%2Fsrc%2Fresources%2Fidx" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full mt-auto bg-secondary/20 backdrop-blur-lg border-t border-border/30">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <h2 className="text-xl font-headline font-bold text-slate-100 mb-6 text-center">Developer Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(resources).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-primary mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      {link.name}
                      <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-border/30 text-center text-xs text-muted-foreground">
            Project ID: active-tangent-463604-p9
        </div>
      </div>
    </footer>
  );
}
