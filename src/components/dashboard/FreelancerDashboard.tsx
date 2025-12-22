import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Heart, TrendingUp, DollarSign, Clock, Star } from "lucide-react";

export const FreelancerDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">Track your earnings and manage your services</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Browse Jobs
          </Button>
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            My Shortlist
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,400</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,680</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 starting today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">Based on 127 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Job Pipeline</CardTitle>
              <CardDescription>Your current job applications and active work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Kitchen Deep Cleaning</h4>
                    <p className="text-sm text-muted-foreground">Applied 2 days ago</p>
                    <p className="text-xs text-muted-foreground">Budget: ₹1,500 - ₹2,000</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Under Review</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">AC Installation</h4>
                    <p className="text-sm text-muted-foreground">Starts in 2 hours</p>
                    <p className="text-xs text-muted-foreground">Duration: 3-4 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹3,200</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Plumbing Repair</h4>
                    <p className="text-sm text-muted-foreground">In progress</p>
                    <p className="text-xs text-muted-foreground">Started 1 hour ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹1,800</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance This Month</CardTitle>
              <CardDescription>Track your key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">95%</p>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">1.2h</p>
                  <p className="text-xs text-muted-foreground">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">12</p>
                  <p className="text-xs text-muted-foreground">Jobs Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Opportunity Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>New Opportunities</CardTitle>
              <CardDescription>Jobs matching your skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="text-sm font-medium">Bathroom Cleaning</h4>
                <p className="text-xs text-muted-foreground">₹800 - ₹1,200 • 2km away</p>
                <Button size="sm" className="w-full mt-2">Quick Apply</Button>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="text-sm font-medium">Home Electrical Work</h4>
                <p className="text-xs text-muted-foreground">₹1,500 - ₹2,500 • 3km away</p>
                <Button size="sm" className="w-full mt-2">Quick Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">₹8,450</p>
                <p className="text-sm text-muted-foreground mb-4">Available for withdrawal</p>
                <Button className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">"Excellent work and very professional"</p>
                  <p className="text-xs text-muted-foreground font-medium">- Amit Singh</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-xs text-muted-foreground">"Quick and efficient service"</p>
                  <p className="text-xs text-muted-foreground font-medium">- Priya Sharma</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};