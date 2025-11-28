'use client';

import { useWallet } from '@/contexts/wallet-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet, LogOut } from 'lucide-react';

export function ConnectWalletButton() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{address.substring(2, 4).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{truncateAddress(address)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{truncateAddress(address)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
