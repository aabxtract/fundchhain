
'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import type { Campaign } from '@/lib/types';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

interface CampaignActionsProps {
  campaign: Campaign;
  onGenericDonate: () => void;
}

export default function CampaignActions({ campaign, onGenericDonate }: CampaignActionsProps) {
  const { isConnected, address, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const isExpired = new Date(campaign.deadline) < new Date();
  const goalReached = campaign.amountRaised >= campaign.goal;
  const isCreator = isConnected && address?.toLowerCase() === campaign.creator.toLowerCase();

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    toast({ title: 'Processing Withdrawal...', description: 'Please wait while we process your transaction.' });
    setTimeout(() => {
      setIsWithdrawing(false);
      toast({ variant: 'default', title: 'Withdrawal Successful!', description: `Successfully withdrew ${campaign.amountRaised} ETH.` });
    }, 3000);
  };

  const handleRefund = () => {
    setIsRefunding(true);
    toast({ title: 'Processing Refund...', description: 'Please wait while we process your transaction.' });
    setTimeout(() => {
      setIsRefunding(false);
      toast({ variant: 'default', title: 'Refund Successful!', description: 'Your donation has been refunded to your wallet.' });
    }, 3000);
  };
  
  if (!isConnected) {
    return <Button onClick={connectWallet} className="w-full">Connect Wallet to Participate</Button>;
  }

  if (isCreator) {
    if (isExpired && goalReached) {
      return (
        <Button onClick={handleWithdraw} disabled={isWithdrawing} className="w-full bg-green-600 hover:bg-green-700">
          {isWithdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
        </Button>
      );
    }
    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>You are the creator!</AlertTitle>
            <AlertDescription>You can withdraw funds after the campaign ends successfully.</AlertDescription>
        </Alert>
    );
  }

  if (isExpired) {
    if (goalReached) {
      return <Alert><AlertTitle>Campaign Successful!</AlertTitle><AlertDescription>This campaign has successfully reached its goal.</AlertDescription></Alert>;
    } else {
      return (
        <Button onClick={handleRefund} disabled={isRefunding} variant="secondary" className="w-full">
          {isRefunding ? 'Refunding...' : 'Claim Refund'}
        </Button>
      );
    }
  }

  return (
     <Button onClick={onGenericDonate} className="w-full text-lg py-6">
      Back this project
    </Button>
  );
}
