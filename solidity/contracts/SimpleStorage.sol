// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    // 0xd9145CCE52D386f254917e481eB44e9943F39138
    //boolean, uint, int, address, bytes

    uint favoriteNumber; //get initialize to 0

    mapping(string => uint256) public nameToFavoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // type, visibilty, variable
    People[] public people; // People[3] gives the array a fixed size;

    //functions:
    // funtion visibility specifier can be in the form of Public, Private, external, internal

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function add() public pure returns (uint256) {
        return 1 + 1;
    }
}
