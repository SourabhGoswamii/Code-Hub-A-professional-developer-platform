"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RiTrophyLine, RiTeamLine, RiFileTextLine, RiMapPinLine, RiGlobalLine, RiUserLine } from "react-icons/ri";

interface Notification {
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface UserData {
  username: string;
  email: string;
  isVerified: boolean;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  karma: number;
  xp: number;
  badges: string[];
  followers: string[];
  following: string[];
  joinedChallenges: string[];
  createdChallenges: string[];
  teams: string[];
  posts: string[];
  comments: string[];
  notifications: Notification[];
  createdAt: string;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/getInfomation");
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch user data");
        }
        
        setUserData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Progress value={33} className="w-[60%] max-w-md" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>{error}</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const level = Math.floor(userData?.xp ? userData.xp / 1000 : 0);
  const xpProgress = userData?.xp ? (userData.xp % 1000) / 10 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Overview */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Profile Card */}
          <Card className="lg:col-span-8 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative w-20 h-20">
                <img
                  src={userData?.avatarUrl || "https://github.com/shadcn.png"}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover border-2 border-primary"
                />
                <Badge className="absolute -bottom-1 -right-1 bg-primary">
                  Level {level}
                </Badge>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{userData?.username}</h1>
                  {userData?.isVerified && (
                    <Badge variant="default" className="bg-blue-500">Verified</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{userData?.bio || "No bio added yet"}</p>
                <div className="flex gap-4 mt-2">
                  {userData?.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <RiMapPinLine className="w-4 h-4" />
                      {userData.location}
                    </div>
                  )}
                  {userData?.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <RiGlobalLine className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* XP Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Level Progress</span>
                    <span>{xpProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userData?.karma || 0}</div>
                    <div className="text-sm text-muted-foreground">Karma</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userData?.followers?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userData?.following?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userData?.badges?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Badges</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card className="lg:col-span-4 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <RiTrophyLine className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Challenges</div>
                  <div className="text-2xl font-bold">
                    {(userData?.joinedChallenges?.length || 0) + (userData?.createdChallenges?.length || 0)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <RiTeamLine className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Teams</div>
                  <div className="text-2xl font-bold">{userData?.teams?.length || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <RiFileTextLine className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Posts</div>
                  <div className="text-2xl font-bold">{userData?.posts?.length || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notifications</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData?.notifications && userData.notifications.length > 0 ? (
                userData.notifications.slice(0, 5).map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary'}`} />
                      <div>
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={notification.read ? "secondary" : "default"}>
                      {notification.read ? "Read" : "New"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notifications yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}