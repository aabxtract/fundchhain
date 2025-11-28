
'use client';

import { campaigns } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet, Award, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import CampaignCard from '@/components/campaign-card';

export default function CreatorProfilePage({ params }: { params: { address: string } }) {
  const creatorAddress = params.address;

  const creatorStats = useMemo(() => {
    const creatorCampaigns = campaigns.filter(c => c.creator.toLowerCase() === creatorAddress.toLowerCase());
    
    if (creatorCampaigns.length === 0) {
      return null;
    }

    const totalCampaigns = creatorCampaigns.length;
    const successfulCampaigns = creatorCampaigns.filter(c => c.amountRaised >= c.goal).length;
    const successRate = totalCampaigns > 0 ? (successfulCampaigns / totalCampaigns) * 100 : 0;
    const totalRaised = creatorCampaigns.reduce((acc, c) => acc + c.amountRaised, 0);

    // Simple reputation score
    const reputation = Math.round(Math.min(100, (successRate * 0.6) + (totalCampaigns * 2) + (totalRaised * 0.1)));

    return {
      campaigns: creatorCampaigns,
      totalCampaigns,
      successfulCampaigns,
      successRate,
      totalRaised,
      reputation,
    };
  }, [creatorAddress]);

  if (!creatorStats) {
    notFound();
  }

  const truncateAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <Card className="text-center">
      <CardContent className="p-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card className="mb-8">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarFallback className="text-4xl">{creatorAddress.substring(2, 4).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Creator Profile</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground justify-center md:justify-start">
              <Wallet className="h-4 w-4" />
              <p className="font-mono text-lg">{truncateAddress(creatorAddress)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Award className="h-6 w-6" />} label="Reputation" value={`${creatorStats.reputation}%`} />
        <StatCard icon={<Target className="h-6 w-6" />} label="Campaigns" value={creatorStats.totalCampaigns} />
        <StatCard icon={<CheckCircle className="h-6 w-6" />} label="Success Rate" value={`${creatorStats.successRate.toFixed(0)}%`} />
        <StatCard icon={<TrendingUp className="h-6 w-6" />} label="Total Raised" value={`${creatorStats.totalRaised.toFixed(2)} ETH`} />
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Campaign History</h2>
        {creatorStats.campaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {creatorStats.campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              This creator hasn't launched any campaigns yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
