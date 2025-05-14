// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract Calculator {
    uint256 private s_results;

    function add(uint256 _val1, uint256 _val2) public returns (uint256) {
        s_results = _val1 + _val2;
    }

    function subtract(uint256 _val1, uint256 _val2) public returns (uint256) {
        s_results = _val1 + _val2;
    }

    function multiply(uint256 _val1, uint256 _val2) public returns (uint256) {
        s_results = _val1 * _val2;
    }

    function getResults() public returns (uint256) {
        return s_results;
    }
}
