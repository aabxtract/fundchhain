
import { addDays, addHours, subDays, subHours } from 'date-fns';
import type { Campaign } from './types';

export const campaigns: Campaign[] = [
  {
    id: '1',
    creator: '0x1A2B3C4D5E6F7G8H9I0J',
    title: 'Decentralized AI Network',
    description: 'Building a peer-to-peer network for distributed AI computation, ensuring privacy and censorship resistance. Our goal is to democratize access to powerful AI models.',
    goal: 100,
    amountRaised: 75,
    deadline: addDays(new Date(), 30).toISOString(),
    completed: false,
    image: 'campaign-1',
    category: 'Tech',
    updates: [
        { id: 'u1-1', title: 'Project Kick-off!', content: 'We\'ve officially started development. The team is excited and we\'re making great progress on the core protocol.', timestamp: subDays(new Date(), 5).toISOString() },
        { id: 'u1-2', title: 'Alpha version coming soon', content: 'We\'re putting the finishing touches on our internal alpha. We expect to release it for testing to early backers in the next few weeks.', timestamp: subDays(new Date(), 1).toISOString() },
    ],
    comments: [
        { id: 'c1-1', author: '0x...aBcDeF', comment: 'This is revolutionary! Can\'t wait to see the alpha.', timestamp: subHours(new Date(), 20).toISOString() },
        { id: 'c1-2', author: '0x...123456', comment: 'Happy to be a backer. How can I contribute to the code?', timestamp: subHours(new Date(), 10).toISOString() },
    ],
    rewards: [
      { id: 'r1-1', title: 'Bronze Supporter NFT', description: 'A unique NFT acknowledging your early support.', pledgeAmount: 0.1 },
      { id: 'r1-2', title: 'Silver Contributor NFT', description: 'Receive a special edition NFT and early access to the alpha.', pledgeAmount: 0.5 },
      { id: 'r1-3', title: 'Gold Partner NFT', description: 'A rare animated NFT, alpha access, and your name in the genesis block.', pledgeAmount: 2 },
    ],
    milestones: [
        { id: 'm1-1', title: 'Protocol Whitepaper', description: 'Publish the technical whitepaper detailing the network architecture.', targetDate: addDays(new Date(), 15).toISOString(), status: 'In Progress' },
        { id: 'm1-2', title: 'Testnet Launch', description: 'Deploy the first public testnet for developers to experiment with.', targetDate: addDays(new Date(), 45).toISOString(), status: 'Pending' },
        { id: 'm1-3', title: 'Mainnet Launch', description: 'Full public launch of the Decentralized AI Network.', targetDate: addDays(new Date(), 90).toISOString(), status: 'Pending' },
    ]
  },
  {
    id: '2',
    creator: '0xK1L2M3N4O5P6Q7R8S9T0',
    title: 'NFT Art Gallery in the Metaverse',
    description: 'Creating a virtual gallery to showcase and auction digital art from emerging artists. A portion of proceeds will go to a charity supporting arts education.',
    goal: 50,
    amountRaised: 55,
    deadline: addHours(new Date(), 48).toISOString(),
    completed: false,
    image: 'campaign-2',
    category: 'Art',
    rewards: [
      { id: 'r2-1', title: 'Founder Token', description: 'An NFT that grants you a permanent "Founder" role in our Discord.', pledgeAmount: 0.05 },
      { id: 'r2-2', title: 'First Exhibit Access', description: 'An NFT that acts as a VIP pass to our opening exhibit.', pledgeAmount: 0.25 },
    ]
  },
  {
    id: '3',
    creator: '0xU1V2W3X4Y5Z6A7B8C9D0',
    title: 'Learn Solidity Interactive Course',
    description: 'An interactive, gamified platform to learn Solidity from scratch. The course will feature code sandboxes, real-world projects, and quizzes to test knowledge.',
    goal: 20,
    amountRaised: 15,
    deadline: addDays(new Date(), 10).toISOString(),
    completed: false,
    image: 'campaign-3',
    category: 'Education'
  },
  {
    id: '4',
    creator: '0xE1F2G3H4I5J6K7L8M9N0',
    title: 'VR Blockchain-based Game',
    description: 'Developing a massive multiplayer online role-playing game (MMORPG) with true asset ownership on the blockchain. All in-game items will be tradable NFTs.',
    goal: 250,
    amountRaised: 80,
    deadline: addDays(new Date(), 90).toISOString(),
    completed: false,
    image: 'campaign-4',
    category: 'Games'
  },
  {
    id: '5',
    creator: '0xP1Q2R3S4T5U6V7W8X9Y0',
    title: 'Goal Not Met - Refundable',
    description: 'This is a sample campaign where the funding goal was not met by the deadline, allowing donors to claim a refund.',
    goal: 100,
    amountRaised: 30,
    deadline: subDays(new Date(), 2).toISOString(),
    completed: false,
    image: 'campaign-5',
    category: 'Art'
  },
    {
    id: '6',
    creator: '0xZ1A2B3C4D5E6F7G8H9I0',
    title: 'Goal Met - Withdrawable',
    description: 'This is a sample campaign where the funding goal has been successfully met, allowing the creator to withdraw the funds.',
    goal: 80,
    amountRaised: 85,
    deadline: subDays(new Date(), 1).toISOString(),
    completed: false,
    image: 'campaign-6',
    category: 'Tech'
  },
];
