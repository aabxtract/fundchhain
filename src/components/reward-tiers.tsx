
'use client';

import type { Campaign, RewardTier } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Gift } from 'lucide-react';

interface RewardTiersProps {
  campaign: Campaign;
  onSelectTier: (tier: RewardTier) => void;
}

export default function RewardTiers({ campaign, onSelectTier }: RewardTiersProps) {
  if (!campaign.rewards || campaign.rewards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            This campaign does not have any special reward tiers. You can still back the project directly!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaign.rewards.map((tier) => (
        <Card key={tier.id} className="transition-all hover:shadow-md">
          <CardHeader>
            <div className='flex justify-between items-start'>
                <div>
                    <CardTitle className="text-xl">{tier.title}</CardTitle>
                    <CardDescription>Pledge {tier.pledgeAmount} ETH or more</CardDescription>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                    <Gift className="h-6 w-6 text-secondary-foreground" />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tier.description}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onSelectTier(tier)}>
              Select Reward
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
