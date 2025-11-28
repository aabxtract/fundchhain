

export interface RewardTier {
  id: string;
  title: string;
  description: string;
  pledgeAmount: number;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface CampaignComment {
    id: string;
    author: string;
    comment: string;
    timestamp: string;
}

export interface Campaign {
  id: string;
  creator: string;
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  deadline: string;
  completed: boolean;
  image: string;
  category: 'Tech' | 'Art' | 'Education' | 'Games';
  updates?: CampaignUpdate[];
  comments?: CampaignComment[];
  rewards?: RewardTier[];
}
