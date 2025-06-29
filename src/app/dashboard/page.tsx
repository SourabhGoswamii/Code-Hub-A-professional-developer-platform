"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen flex items-center justify-center">
        <Progress value={33} className="w-[60%] mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Overview Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <h3 className="text-2xl font-bold">{userData?.username || 'Not set'}</h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <h3 className="text-lg font-medium truncate">{userData?.email || 'Not set'}</h3>
                  <Badge variant={userData?.isVerified ? "default" : "destructive"} className="mt-1">
                    {userData?.isVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <h3 className="text-lg font-medium">{userData?.name || 'Not set'}</h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <h3 className="text-lg font-medium">{userData?.location || 'Not set'}</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <h3 className="text-lg font-medium truncate">
                    {userData?.website ? (
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {userData.website}
                      </a>
                    ) : 'Not set'}
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-sm text-muted-foreground">
                    {userData?.bio || 'No bio added yet'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-sm">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Karma Points</p>
                <h3 className="text-2xl font-bold">{userData?.karma || 0}</h3>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Experience (XP)</p>
                <h3 className="text-2xl font-bold">{userData?.xp || 0}</h3>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm">Followers</p>
                    <p className="text-xl font-bold">{userData?.followers?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm">Following</p>
                    <p className="text-xl font-bold">{userData?.following?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData?.badges && userData.badges.length > 0 ? (
                    userData.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary">{badge}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No badges yet</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Challenges</p>
                  <div className="mt-1">
                    <p className="text-sm">Created: {userData?.createdChallenges?.length || 0}</p>
                    <p className="text-sm">Joined: {userData?.joinedChallenges?.length || 0}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Community</p>
                  <div className="mt-1">
                    <p className="text-sm">Posts: {userData?.posts?.length || 0}</p>
                    <p className="text-sm">Comments: {userData?.comments?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Teams</p>
                <p className="text-sm mt-1">Member of {userData?.teams?.length || 0} teams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData?.notifications && userData.notifications.length > 0 ? (
                userData.notifications.slice(0, 5).map((notification, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={notification.read ? "secondary" : "default"}>
                      {notification.read ? "Read" : "New"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}