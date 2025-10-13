import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Search, 
  Heart,
  Leaf,
  Calendar,
  Star
} from "lucide-react";

const communityMetrics = [
  {
    icon: Users,
    label: "Community Members",
    value: "2,547",
    change: "+12%",
    progress: 85,
    color: "bg-primary"
  },
  {
    icon: Briefcase,
    label: "Active Job Listings",
    value: "147",
    change: "+23%",
    progress: 70,
    color: "bg-community-blue"
  },
  {
    icon: Search,
    label: "Items Reunited",
    value: "89",
    change: "+8%",
    progress: 90,
    color: "bg-success"
  },
  {
    icon: Heart,
    label: "Resources Shared",
    value: "1,234",
    change: "+15%",
    progress: 75,
    color: "bg-community-orange"
  }
];

const recentActivity = [
  {
    icon: Star,
    title: "New Business Joined",
    description: "Green Valley Café just joined our local business network",
    time: "2 hours ago",
    type: "business"
  },
  {
    icon: Heart,
    title: "Food Sharing Success",
    description: "50 meals distributed to families in need this week",
    time: "5 hours ago",
    type: "social"
  },
  {
    icon: Leaf,
    title: "Recycling Milestone",
    description: "Community recycled 2 tons of waste this month!",
    time: "1 day ago",
    type: "environment"
  },
  {
    icon: Calendar,
    title: "Upcoming Event",
    description: "Community cleanup drive scheduled for this weekend",
    time: "2 days ago",
    type: "event"
  }
];

const getActivityColor = (type: string) => {
  switch (type) {
    case "business":
      return "bg-community-blue/20 text-community-blue";
    case "social":
      return "bg-community-orange/20 text-community-orange";
    case "environment":
      return "bg-success/20 text-success";
    case "event":
      return "bg-accent/20 text-accent";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const CommunityStats = () => {
  return (
    <section id="community" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Community Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our community is making a difference together
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityMetrics.map((metric) => (
            <Card key={metric.label} className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.color} rounded-full flex items-center justify-center`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center text-success text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {metric.change}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Recent Community Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-gradient-hero text-white cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-center">
                    <Briefcase className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">Post Job</div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-success text-white cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-center">
                    <Search className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">Found Item</div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-community-orange text-white cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">Share Food</div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-accent text-white cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-center">
                    <Leaf className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">Green Action</div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};