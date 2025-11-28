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
}
