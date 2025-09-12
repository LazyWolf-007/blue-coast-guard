import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Users,
  TreePine,
  TrendingUp,
  Award,
  Eye,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface DashboardOverviewProps {
  role: string;
}

const DashboardOverview = ({ role }: DashboardOverviewProps) => {
  const getRoleSpecificContent = () => {
    switch (role) {
      case "community":
        return {
          title: "Your Community Impact",
          stats: [
            { icon: TreePine, label: "Trees You've Planted", value: "127", color: "text-secondary" },
            { icon: Award, label: "Carbon Credits Earned", value: "23.4", color: "text-primary" },
            { icon: MapPin, label: "Active Projects", value: "3", color: "text-accent" },
            { icon: TrendingUp, label: "Weekly Progress", value: "+15%", color: "text-secondary" }
          ],
          actionCards: [
            {
              title: "Log Today's Planting",
              description: "Record your mangrove restoration activities",
              action: "Log Activity",
              icon: Plus,
              variant: "default" as const
            },
            {
              title: "Verify Growth Progress",
              description: "Submit photos of your planted areas",
              action: "Upload Photos",
              icon: Eye,
              variant: "secondary" as const
            }
          ]
        };

      case "ngo":
        return {
          title: "Project Management Hub",
          stats: [
            { icon: MapPin, label: "Active Projects", value: "12", color: "text-primary" },
            { icon: Users, label: "Community Members", value: "234", color: "text-secondary" },
            { icon: TreePine, label: "Total Trees Planted", value: "5.2k", color: "text-secondary" },
            { icon: CheckCircle, label: "Verified Activities", value: "89%", color: "text-primary" }
          ],
          actionCards: [
            {
              title: "Create New Project",
              description: "Set up a new restoration initiative",
              action: "Create Project",
              icon: Plus,
              variant: "default" as const
            },
            {
              title: "Review Submissions",
              description: "Verify community member activities",
              action: "Review Queue",
              icon: Clock,
              variant: "secondary" as const
            }
          ]
        };

      case "government":
        return {
          title: "Government Oversight Panel",
          stats: [
            { icon: MapPin, label: "Total Projects", value: "127", color: "text-accent" },
            { icon: Users, label: "Registered NGOs", value: "45", color: "text-primary" },
            { icon: TreePine, label: "State-wide Trees", value: "89.2k", color: "text-secondary" },
            { icon: TrendingUp, label: "Compliance Rate", value: "94%", color: "text-accent" }
          ],
          actionCards: [
            {
              title: "Verification Queue",
              description: "Review pending project approvals",
              action: "Review Applications",
              icon: AlertTriangle,
              variant: "default" as const
            },
            {
              title: "Generate Report",
              description: "Create monthly restoration summary",
              action: "Generate Report",
              icon: TrendingUp,
              variant: "secondary" as const
            }
          ]
        };

      case "researcher":
        return {
          title: "Research Data Explorer",
          stats: [
            { icon: TreePine, label: "Data Points", value: "15.7k", color: "text-primary" },
            { icon: TrendingUp, label: "Growth Rate", value: "23.4%", color: "text-secondary" },
            { icon: MapPin, label: "Study Sites", value: "67", color: "text-accent" },
            { icon: CheckCircle, label: "Analysis Complete", value: "78%", color: "text-primary" }
          ],
          actionCards: [
            {
              title: "Download Dataset",
              description: "Export latest restoration data",
              action: "Export Data",
              icon: TrendingUp,
              variant: "default" as const
            },
            {
              title: "View Analytics",
              description: "Explore detailed restoration metrics",
              action: "Open Analytics",
              icon: Eye,
              variant: "secondary" as const
            }
          ]
        };

      default:
        return {
          title: "Dashboard Overview",
          stats: [],
          actionCards: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">{content.title}</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your latest restoration impact.
          </p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto">
          Last updated: 2 mins ago
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.stats.map((stat, index) => (
          <Card key={index} className="group hover:shadow-gentle transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {content.actionCards.map((card, index) => (
          <Card key={index} className="group hover:shadow-gentle transition-all duration-300 animate-slide-up" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
              <div className="p-2 rounded-lg bg-muted">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{card.description}</p>
              <Button variant={card.variant} className="w-full group">
                {card.action}
                <card.icon className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="animate-fade-in" style={{ animationDelay: "600ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New mangrove site verified", location: "Sundarbans, West Bengal", time: "2 hours ago" },
              { action: "Community member joined", location: "Konark Beach, Odisha", time: "4 hours ago" },
              { action: "Carbon credits issued", location: "Pichavaram, Tamil Nadu", time: "6 hours ago" },
              { action: "Growth measurement recorded", location: "Bhitarkanika, Odisha", time: "8 hours ago" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activity.location}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card className="animate-fade-in" style={{ animationDelay: "700ms" }}>
        <CardHeader>
          <CardTitle>Monthly Restoration Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Trees Planted</span>
                <span>890 / 1000</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Area Restored</span>
                <span>23.4 / 30 hectares</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Community Engagement</span>
                <span>156 / 200 members</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;