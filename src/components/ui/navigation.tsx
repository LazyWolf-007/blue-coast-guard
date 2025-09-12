import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TreePine, 
  Users, 
  Building2, 
  Shield, 
  FlaskConical,
  Menu,
  User,
  Settings
} from "lucide-react";

interface NavigationProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const roles = [
  {
    id: "community",
    name: "Community Member",
    icon: Users,
    color: "bg-secondary",
    description: "Local restoration participant"
  },
  {
    id: "ngo",
    name: "NGO Manager",
    icon: Building2,
    color: "bg-primary",
    description: "Project coordination and management"
  },
  {
    id: "government",
    name: "Government Admin",
    icon: Shield,
    color: "bg-accent",
    description: "Oversight and verification"
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: FlaskConical,
    color: "bg-muted",
    description: "Data analysis and insights"
  }
];

const Navigation = ({ currentRole, onRoleChange }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentRoleData = roles.find(role => role.id === currentRole);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ocean-gradient rounded-lg flex items-center justify-center">
              <TreePine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Blue Carbon MRV</h1>
              <p className="text-xs text-muted-foreground">Restoration Registry</p>
            </div>
          </div>

          {/* Role Selector */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-muted-foreground">View as:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {currentRoleData && (
                    <>
                      <currentRoleData.icon className="h-4 w-4" />
                      {currentRoleData.name}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 bg-card/95 backdrop-blur-sm">
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role.id}
                    onClick={() => onRoleChange(role.id)}
                    className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50"
                  >
                    <div className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center`}>
                      <role.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </div>
                    {role.id === currentRole && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
              Priya Sharma
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="space-y-2 pt-4">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant={role.id === currentRole ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    onRoleChange(role.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <role.icon className="h-4 w-4" />
                  {role.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;