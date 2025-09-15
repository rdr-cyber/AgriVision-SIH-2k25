'use client';

import { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Leaf, 
  Target, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Gift,
  Users,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data for rewards program
const rewardsData = {
  currentPoints: 1250,
  tier: 'Gold Farmer',
  nextTier: 'Platinum Farmer',
  pointsToNextTier: 750,
  totalEarnings: 24500,
  samplesSubmitted: 42,
  samplesApproved: 38,
  badges: [
    { id: 1, name: 'First Submission', earned: true, icon: Leaf },
    { id: 2, name: 'Quality Champion', earned: true, icon: Star },
    { id: 3, name: 'Consistency Master', earned: true, icon: Target },
    { id: 4, name: 'Top Contributor', earned: false, icon: Trophy },
    { id: 5, name: 'Eco Warrior', earned: true, icon: Award },
    { id: 6, name: 'Community Leader', earned: false, icon: Users }
  ],
  recentRewards: [
    { id: 1, title: '₹500 Cashback', description: 'For submitting 10 quality samples', date: '2023-06-10', claimed: true },
    { id: 2, title: 'Free Soil Test Kit', description: 'Premium soil analysis kit', date: '2023-05-22', claimed: true },
    { id: 3, title: 'Advanced Training Workshop', description: 'Organic farming techniques', date: '2023-04-15', claimed: true }
  ],
  availableRewards: [
    { id: 1, title: '₹1000 Cashback', description: 'For reaching Gold tier', points: 2000, claimed: false },
    { id: 2, title: 'Premium Seed Pack', description: 'Rare herb seed varieties', points: 1500, claimed: false },
    { id: 3, title: 'Farm Equipment Voucher', description: 'Up to ₹5000 value', points: 3000, claimed: false },
    { id: 4, title: 'Expert Consultation', description: '1-hour session with agricultural specialist', points: 2500, claimed: false }
  ]
};

export default function RewardsProgramPage() {
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  const handleClaimReward = (rewardId: number) => {
    setClaimedRewards([...claimedRewards, rewardId]);
    // In a real app, this would call an API to claim the reward
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze Farmer': return 'bg-amber-100 text-amber-800';
      case 'Silver Farmer': return 'bg-gray-100 text-gray-800';
      case 'Gold Farmer': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum Farmer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const approvalRate = Math.round(
    (rewardsData.samplesApproved / rewardsData.samplesSubmitted) * 100
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Farmer Rewards Program</h1>
        <p className="text-muted-foreground">
          Earn points, unlock rewards, and advance your farming career
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Current Points
            </CardDescription>
            <CardTitle className="text-3xl">{rewardsData.currentPoints}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {rewardsData.pointsToNextTier} points to {rewardsData.nextTier}
            </p>
            <Progress 
              value={(rewardsData.currentPoints / (rewardsData.currentPoints + rewardsData.pointsToNextTier)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              Current Tier
            </CardDescription>
            <CardTitle className="text-2xl">
              <Badge className={getTierColor(rewardsData.tier)}>
                {rewardsData.tier}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Next tier: {rewardsData.nextTier}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Total Earnings
            </CardDescription>
            <CardTitle className="text-3xl">₹{rewardsData.totalEarnings.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From {rewardsData.samplesApproved} approved samples
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Track your progress and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Samples Submitted</h3>
              </div>
              <p className="text-2xl font-bold">{rewardsData.samplesSubmitted}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Samples Approved</h3>
              </div>
              <p className="text-2xl font-bold">{rewardsData.samplesApproved}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Approval Rate</h3>
              </div>
              <p className="text-2xl font-bold">{approvalRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Farmer Badges</CardTitle>
          <CardDescription>
            Achievements and milestones you've reached
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {rewardsData.badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`flex flex-col items-center p-4 border rounded-lg ${
                  badge.earned ? 'bg-primary/5 border-primary/20' : 'opacity-50'
                }`}
              >
                <div className={`p-3 rounded-full mb-2 ${
                  badge.earned ? 'bg-primary/10 text-primary' : 'bg-muted'
                }`}>
                  <badge.icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium text-center">{badge.name}</h3>
                {badge.earned ? (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Earned
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Locked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewardsData.availableRewards.map((reward) => (
            <Card key={reward.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      {reward.title}
                    </CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{reward.points} pts</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {rewardsData.currentPoints >= reward.points 
                        ? 'Eligible to claim' 
                        : `${reward.points - rewardsData.currentPoints} points needed`}
                    </p>
                    <Progress 
                      value={Math.min(100, (rewardsData.currentPoints / reward.points) * 100)} 
                      className="mt-2" 
                    />
                  </div>
                  <Button 
                    disabled={rewardsData.currentPoints < reward.points || claimedRewards.includes(reward.id)}
                    onClick={() => handleClaimReward(reward.id)}
                  >
                    {claimedRewards.includes(reward.id) ? 'Claimed' : 'Claim'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Claimed Rewards</CardTitle>
          <CardDescription>
            Rewards you've claimed in the past
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rewardsData.recentRewards.length > 0 ? (
            <div className="space-y-3">
              {rewardsData.recentRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Claimed on {new Date(reward.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Claimed
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              You haven't claimed any rewards yet. Start submitting quality samples to earn points!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}