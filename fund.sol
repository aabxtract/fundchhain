// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
  Crowdfunding.sol
  Simple on-chain crowdfunding contract (ETH-based)

  Features:
  - createCampaign(title, description, goal, deadline)
  - donateToCampaign(campaignId) payable
  - withdraw(campaignId) by campaign creator if goal reached before or at deadline
  - refund(campaignId) by donors if campaign failed after deadline
  - events for creation, donation, withdraw, refund
  - contribution tracking per donor per campaign
  - ReentrancyGuard protection for external calls
*/

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Crowdfunding is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _campaignIds;

    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        uint256 goal;         // in wei
        uint256 amountRaised; // in wei
        uint256 deadline;     // unix timestamp
        bool withdrawn;       // whether creator has withdrawn funds
    }

    // campaignId => Campaign
    mapping(uint256 => Campaign) private campaigns;

    // campaignId => donor => amount donated
    mapping(uint256 => mapping(address => uint256)) private contributions;

    // events
    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event Donated(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event Withdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    event Refunded(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    // ============ Public / External functions ============

    /**
     * @dev Create a new crowdfunding campaign.
     * @param _title Campaign title (short)
     * @param _description Campaign description (longer)
     * @param _goal Funding goal in wei (must be > 0)
     * @param _deadline Unix timestamp for deadline (must be in future)
     */
    function createCampaign(
        string calldata _title,
        string calldata _description,
        uint256 _goal,
        uint256 _deadline
    ) external returns (uint256) {
        require(_goal > 0, "Goal must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");

        _campaignIds.increment();
        uint256 newId = _campaignIds.current();

        campaigns[newId] = Campaign({
            id: newId,
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            goal: _goal,
            amountRaised: 0,
            deadline: _deadline,
            withdrawn: false
        });

        emit CampaignCreated(newId, msg.sender, _title, _goal, _deadline);
        return newId;
    }

    /**
     * @dev Donate ETH to a campaign. Must be before deadline.
     * @param _campaignId target campaign id
     */
    function donateToCampaign(uint256 _campaignId) external payable nonReentrant {
        Campaign storage c = campaigns[_campaignId];
        require(c.id != 0, "Campaign not found");
        require(block.timestamp <= c.deadline, "Campaign deadline passed");
        require(msg.value > 0, "Donation must be > 0");
        require(!c.withdrawn, "Campaign already withdrawn");

        // update state
        c.amountRaised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        emit Donated(_campaignId, msg.sender, msg.value);
    }

    /**
     * @dev Withdraw funds for a successful campaign.
     * Only campaign creator, only if goal reached and not withdrawn.
     * Can be called anytime (even after deadline) if condition met.
     */
    function withdraw(uint256 _campaignId) external nonReentrant {
        Campaign storage c = campaigns[_campaignId];
        require(c.id != 0, "Campaign not found");
        require(msg.sender == c.creator, "Not campaign creator");
        require(!c.withdrawn, "Already withdrawn");
        require(c.amountRaised >= c.goal, "Goal not reached");

        uint256 amount = c.amountRaised;
        c.withdrawn = true;        // effects before interaction
        // transfer to creator
        (bool ok, ) = c.creator.call{value: amount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(_campaignId, c.creator, amount);
    }

    /**
     * @dev Refund donor if campaign failed (deadline passed and goal not reached).
     * Donor can call to get back their contribution for the campaign.
     */
    function refund(uint256 _campaignId) external nonReentrant {
        Campaign storage c = campaigns[_campaignId];
        require(c.id != 0, "Campaign not found");
        require(block.timestamp > c.deadline, "Campaign still active");
        require(c.amountRaised < c.goal, "Campaign succeeded, can't refund");

        uint256 donated = contributions[_campaignId][msg.sender];
        require(donated > 0, "No contribution to refund");

        // zero out before transfer to prevent re-entrancy
        contributions[_campaignId][msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: donated}("");
        require(ok, "Refund transfer failed");

        emit Refunded(_campaignId, msg.sender, donated);
    }

    // ============ View / Getter functions ============

    function getCampaign(uint256 _campaignId) external view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 amountRaised,
        uint256 deadline,
        bool withdrawn
    ) {
        Campaign storage c = campaigns[_campaignId];
        require(c.id != 0, "Campaign not found");
        return (
            c.id,
            c.creator,
            c.title,
            c.description,
            c.goal,
            c.amountRaised,
            c.deadline,
            c.withdrawn
        );
    }

    /**
     * @dev Returns number of campaigns created so far.
     */
    function getCampaignCount() external view returns (uint256) {
        return _campaignIds.current();
    }

    /**
     * @dev Get contribution amount of a donor for a campaign.
     */
    function getContribution(uint256 _campaignId, address _donor) external view returns (uint256) {
        return contributions[_campaignId][_donor];
    }

    // Optional helper to fetch campaigns in a range (frontends often index off-chain for efficiency)
    function getCampaigns(uint256 start, uint256 end) external view returns (Campaign[] memory) {
        require(start >= 1 && end <= _campaignIds.current() && start <= end, "Invalid range");
        uint256 len = end - start + 1;
        Campaign[] memory list = new Campaign[](len);
        uint256 idx = 0;
        for (uint256 i = start; i <= end; i++) {
            Campaign storage c = campaigns[i];
            list[idx] = c;
            idx++;
        }
        return list;
    }

    // ============ Fallback / Receive ============

    // Prevent accidental ETH send to contract without calling donate function
    receive() external payable {
        revert("Use donateToCampaign to send ETH");
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
