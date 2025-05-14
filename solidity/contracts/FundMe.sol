// SPDX-License-Identifier: MIT
//pragma
pragma solidity ^0.8.24;
//imports
import "./PriceConverter.sol";

//error codes
error FundMe__NotOwner();

//interfaces,libraries,contracts

/**@title A contract for crowd funding
 * @author Kamasah Dickson
 * @notice This contract is to demo a sample funding contract
 * @dev This implement price feeds as our environment
 */

contract FundMe {
    //Type declarations
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //state variables
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    //events,modifiers

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    //constructors
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //recieve
    receive() external payable {
        fund();
    }

    //fallback
    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     * @dev This implement price feeds as our environment
     */

    function fund() public payable {
        // set a minimum fund amount in USD
        require(
            PriceConverter.getConversionRate(msg.value, s_priceFeed) >
                MINIMUM_USD,
            "Didn't send a minimum ETH"
        ); //1e18 = 1 * 10 * 1000000000000000000 or 1^18
        s_funders.push(msg.sender);
    }

    //veiw / pure
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function withdraw() public onlyOwner {
        for (
            uint funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Failed to withdraw funds");
    }

    function cheaperWithdraw() public payable {
        address[] memory funders = s_funders;
        //mappings cant be in memmory
        for (
            uint256 fundersIndex = 0;
            fundersIndex < funders.length;
            fundersIndex++
        ) {
            address funder = s_funders[fundersIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Failed to withdraw funds");
    }
}
