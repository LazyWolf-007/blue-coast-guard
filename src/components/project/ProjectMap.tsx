import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  TreePine,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  CheckCircle
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  status: "planning" | "active" | "completed";
  treesPlanted: number;
  areaRestored: number;
  communityMembers: number;
  carbonSequestered: number;
  lastUpdate: string;
  image: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Sundarbans Mangrove Revival",
    location: "West Bengal Coast",
    coordinates: [88.4, 21.9],
    status: "active",
    treesPlanted: 1247,
    areaRestored: 15.3,
    communityMembers: 34,
    carbonSequestered: 89.2,
    lastUpdate: "2024-12-15",
    image: "🌊"
  },
  {
    id: "2",
    name: "Pichavaram Restoration",
    location: "Tamil Nadu",
    coordinates: [79.8, 11.4],
    status: "completed",
    treesPlanted: 2156,
    areaRestored: 22.7,
    communityMembers: 67,
    carbonSequestered: 156.4,
    lastUpdate: "2024-12-10",
    image: "🌴"
  },
  {
    id: "3",
    name: "Bhitarkanika Conservation",
    location: "Odisha",
    coordinates: [86.9, 20.7],
    status: "active",
    treesPlanted: 892,
    areaRestored: 11.2,
    communityMembers: 28,
    carbonSequestered: 67.8,
    lastUpdate: "2024-12-14",
    image: "🦅"
  },
  {
    id: "4",
    name: "Konark Beach Initiative",
    location: "Odisha Coast",
    coordinates: [86.1, 19.9],
    status: "planning",
    treesPlanted: 0,
    areaRestored: 0,
    communityMembers: 15,
    carbonSequestered: 0,
    lastUpdate: "2024-12-12",
    image: "🏖️"
  }
];

const ProjectMap = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0]);
  const [filter, setFilter] = useState<"all" | "planning" | "active" | "completed">("all");

  const filteredProjects = filter === "all" ? mockProjects : mockProjects.filter(p => p.status === filter);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning": return "bg-accent";
      case "active": return "bg-primary";
      case "completed": return "bg-secondary";
      default: return "bg-muted";
    }
  };

  const getStatusText = (status: Project["status"]) => {
    switch (status) {
      case "planning": return "Planning";
      case "active": return "Active";
      case "completed": return "Completed";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Locations</h2>
          <p className="text-muted-foreground">
            Interactive map of restoration projects across India's coastline
          </p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "planning", "active", "completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status as any)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area - Simulated with visual representation */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] relative overflow-hidden group hover:shadow-gentle transition-all duration-300">
            <CardContent className="p-0 h-full">
              {/* Simulated Map Background */}
              <div className="h-full bg-ocean-depth relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/30 rounded-full blur-xl" />
                  <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
                  <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/25 rounded-full blur-lg" />
                </div>
                
                {/* India Coastline Representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-10 transform rotate-12">
                    🗺️
                  </div>
                </div>

                {/* Project Pins */}
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                      selectedProject?.id === project.id ? "scale-125 z-10" : ""
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className={`w-4 h-4 ${getStatusColor(project.status)} rounded-full shadow-lg border-2 border-white pulse-glow`} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.name}
                    </div>
                  </div>
                ))}

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">+</Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">−</Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="text-xs font-medium text-foreground mb-2">Project Status</div>
                  {["planning", "active", "completed"].map((status) => (
                    <div key={status} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 ${getStatusColor(status as Project["status"])} rounded-full`} />
                      <span className="capitalize text-foreground">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details Panel */}
        <div className="space-y-4">
          {/* Selected Project Details */}
          {selectedProject && (
            <Card className="animate-scale-in">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedProject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedProject.location}
                    </p>
                  </div>
                  <div className="text-2xl">{selectedProject.image}</div>
                </div>
                <Badge variant="secondary" className={getStatusColor(selectedProject.status)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {getStatusText(selectedProject.status)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-secondary">{selectedProject.treesPlanted}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <TreePine className="h-3 w-3" />
                      Trees Planted
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">{selectedProject.areaRestored}ha</div>
                    <div className="text-xs text-muted-foreground">Area Restored</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-accent">{selectedProject.communityMembers}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      Community
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-secondary">{selectedProject.carbonSequestered}t</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      CO₂ Absorbed
                    </div>
                  </div>
                </div>

                {/* Last Update */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Last updated:
                  </span>
                  <span className="font-medium">{selectedProject.lastUpdate}</span>
                </div>

                {/* Action Button */}
                <Button className="w-full" variant="default">
                  <Eye className="h-4 w-4 mr-2" />
                  View Project Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Project List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      selectedProject?.id === project.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{project.name}</div>
                      <Badge variant="outline" className={`${getStatusColor(project.status)} text-white text-xs`}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {project.treesPlanted} trees • {project.communityMembers} members
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;