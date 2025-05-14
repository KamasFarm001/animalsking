// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

error Not__Owner();

contract SimpleStorage2 {
    // store
    //withdraw only by owner
    address private immutable i_owner;
    mapping(address => uint) private amountInStore;

    struct People {
        uint name;
        uint favoriteNumber;
    }

    People[] private people;

    function store(uint _name, uint _favoriteNumber) public {
        people.push(People(_name, _favoriteNumber));
    }

    function withdraw() public payable onlyOwner {}

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Not__Owner();
        }
        _;
    }
}
