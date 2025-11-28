Web3 Crowdfunding dApp

A decentralized crowdfunding platform inspired by Kickstarter, where anyone can create campaigns, donate, and withdraw funds — all powered by smart contracts and fully on-chain logic.

This project is perfect for learning real Web3 development: struct-based storage, events, donations, deadlines, withdrawals, refunds, and frontend–contract interaction.

🌟 Overview

The Web3 Crowdfunding dApp allows users to:

Create crowdfunding campaigns

Set a funding goal and deadline

Receive donations from other users

Withdraw funds if the campaign succeeds

Refund donors if the campaign fails

All campaigns and donations are stored on-chain, ensuring transparency, security, and immutability.

✨ Features
👤 Campaign Creator Features

Create a campaign with:

Title

Description

Funding Goal

Deadline

Withdraw raised funds if the goal is reached before the deadline

🤝 Donor Features

Explore all campaigns

Donate using connected wallet

If campaign fails → donors can refund their contribution

🧠 Smart Contract Highlights

createCampaign()

donateToCampaign()

withdraw()

refund()

Struct-based campaign storage

Events:

CampaignCreated

Donated

Withdrawn

Refunded

💻 Frontend

Clean and futuristic UI

Campaign list view

Campaign details page with:

Progress bar

Funding goal

Amount raised

Countdown timer

Donation modal

Wallet connection using RainbowKit

Toast notifications

🛠️ Tech Stack
Smart Contracts

Solidity

Hardhat or Foundry

Frontend

Next.js

TailwindCSS

Wagmi + Viem

RainbowKit

📦 Smart Contract Structure

A campaign is stored as:

struct Campaign {
    address creator;
    string title;
    string description;
    uint goal;
    uint amountRaised;
    uint deadline;
    bool completed;
}

🔗 User Flow
Creating a Campaign

Connect wallet

Fill campaign details

Submit transaction

Campaign appears in the list instantly

Donating

Select a campaign

Enter donation amount

Confirm transaction

Progress bar updates in real-time

Ending a Campaign

If goal is met before deadline → creator withdraws

If not → donors get refunds

🧪 Local Development Setup
1️⃣ Clone the repo
git clone https://github.com/yourname/web3-crowdfunding.git
cd web3-crowdfunding

2️⃣ Install dependencies
npm install

3️⃣ Start local blockchain (Hardhat)
npx hardhat node

4️⃣ Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

5️⃣ Run the frontend
npm run dev

📁 Project Structure
/contracts
  └── Crowdfunding.sol
/frontend
  ├── components/
  ├── pages/
  ├── styles/
  └── utils/

🔮 Future Enhancements

NFT badges for top donors

Category filtering (Tech, Art, Education, etc.)

Social share for campaigns

Featured campaigns section

Admin dashboard

Multi-token support

📝 License

MIT License — free to use, modify, and build upon.