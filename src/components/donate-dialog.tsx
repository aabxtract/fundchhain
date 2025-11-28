
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Campaign, RewardTier } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface DonateDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier?: RewardTier | null;
}

export function DonateDialog({ campaign, open, onOpenChange, selectedTier }: DonateDialogProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTier) {
      setAmount(selectedTier.pledgeAmount.toString());
    } else {
      setAmount('');
    }
  }, [selectedTier, open]);


  const handleDonate = async () => {
    const numericAmount = parseFloat(amount);
    
    if (!amount || numericAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid donation amount.',
      });
      return;
    }

    if (selectedTier && numericAmount < selectedTier.pledgeAmount) {
       toast({
        variant: 'destructive',
        title: 'Amount Too Low',
        description: `The minimum pledge for the "${selectedTier.title}" tier is ${selectedTier.pledgeAmount} ETH.`,
      });
      return;
    }
    
    setIsLoading(true);
    toast({ title: 'Processing Donation...', description: 'Please confirm the transaction in your wallet.' });
    
    // Simulate blockchain transaction
    setTimeout(() => {
        setIsLoading(false);
        onOpenChange(false);
        toast({
            title: 'Donation Successful!',
            description: `You have successfully donated ${amount} ETH to "${campaign.title}".`,
        });
        // In a real app, you would refetch campaign data here.
        // For this mock, we don't update the UI state.
    }, 3000);
  };

  const dialogTitle = selectedTier 
    ? `Claim "${selectedTier.title}" Reward` 
    : `Back "${campaign.title}"`;

  const dialogDescription = selectedTier 
    ? `You've selected the "${selectedTier.title}" tier. You can increase your pledge amount if you wish.`
    : "Enter the amount of ETH you'd like to contribute. Your support is greatly appreciated!";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        {selectedTier && (
          <div className="py-2">
            <Badge variant="secondary">Pledge at least {selectedTier.pledgeAmount} ETH</Badge>
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (ETH)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="0.1"
              min={selectedTier?.pledgeAmount}
              step="0.01"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDonate} disabled={isLoading} className="w-full">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Donate ${amount || ''} ETH`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
