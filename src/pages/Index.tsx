import { useState } from "react";
import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ProjectMap from "@/components/project/ProjectMap";
import BlockchainTracker from "@/components/blockchain/BlockchainTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Map, 
  Shield, 
  Users, 
  TreePine,
  TrendingUp
} from "lucide-react";

const Index = () => {
  const [currentRole, setCurrentRole] = useState("community");
  const [currentView, setCurrentView] = useState("overview");

  const getNavItems = () => {
    const baseItems = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "map", label: "Project Map", icon: Map },
      { id: "blockchain", label: "Blockchain", icon: Shield }
    ];

    return baseItems;
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview role={currentRole} />;
      case "map":
        return <ProjectMap />;
      case "blockchain":
        return <BlockchainTracker />;
      default:
        return <DashboardOverview role={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentRole={currentRole} onRoleChange={setCurrentRole} />
      
      {/* Show hero section only on overview */}
      {currentView === "overview" && <HeroSection />}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {getNavItems().map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "outline"}
              onClick={() => setCurrentView(item.id)}
              className="gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ocean-gradient rounded-lg flex items-center justify-center">
                  <TreePine className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold gradient-text">Blue Carbon MRV</h3>
                  <p className="text-xs text-muted-foreground">Restoration Registry</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering communities to restore India's coastal ecosystems through 
                transparent, blockchain-verified environmental action.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Project Dashboard</li>
                <li>Community Features</li>
                <li>Verification System</li>
                <li>Carbon Credits</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Best Practices</li>
                <li>Support Center</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Impact Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <TreePine className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">89,247 trees planted</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">2,431 community members</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">1,247 tons CO₂ sequestered</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Blue Carbon MRV Registry. Built for India's environmental future.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>API Docs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
