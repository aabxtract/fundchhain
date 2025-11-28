'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Campaign } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface DonateDialogProps {
    campaign: Campaign;
}

export function DonateDialog({ campaign }: DonateDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid donation amount.',
      });
      return;
    }
    
    setIsLoading(true);
    toast({ title: 'Processing Donation...', description: 'Please confirm the transaction in your wallet.' });
    
    // Simulate blockchain transaction
    setTimeout(() => {
        setIsLoading(false);
        setOpen(false);
        toast({
            title: 'Donation Successful!',
            description: `You have successfully donated ${amount} ETH to "${campaign.title}".`,
        });
        // In a real app, you would refetch campaign data here.
        // For this mock, we don't update the UI state.
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-lg py-6">Back this project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Back "{campaign.title}"</DialogTitle>
          <DialogDescription>
            Enter the amount of ETH you'd like to contribute. Your support is greatly appreciated!
          </DialogDescription>
        </DialogHeader>
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
