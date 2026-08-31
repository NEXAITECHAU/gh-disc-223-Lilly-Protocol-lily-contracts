// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LilyProtocol is Ownable {
    // Config storage
    mapping(bytes32 => uint256) private _configUint;
    mapping(bytes32 => address) private _configAddress;
    mapping(bytes32 => bool) private _configBool;
    mapping(bytes32 => string) private _configString;

    // Events
    event ConfigSet(bytes32 indexed key, uint256 value);
    event ConfigSetAddress(bytes32 indexed key, address value);
    event ConfigSetBool(bytes32 indexed key, bool value);
    event ConfigSetString(bytes32 indexed key, string value);

    // Single-key config view functions
    function getConfig(bytes32 key) external view returns (uint256) {
        return _configUint[key];
    }

    function getConfigAddress(bytes32 key) external view returns (address) {
        return _configAddress[key];
    }

    function getConfigBool(bytes32 key) external view returns (bool) {
        return _configBool[key];
    }

    function getConfigString(bytes32 key) external view returns (string memory) {
        return _configString[key];
    }

    // Config setter functions (only owner)
    function setConfig(bytes32 key, uint256 value) external onlyOwner {
        _configUint[key] = value;
        emit ConfigSet(key, value);
    }

    function setConfigAddress(bytes32 key, address value) external onlyOwner {
        _configAddress[key] = value;
        emit ConfigSetAddress(key, value);
    }

    function setConfigBool(bytes32 key, bool value) external onlyOwner {
        _configBool[key] = value;
        emit ConfigSetBool(key, value);
    }

    function setConfigString(bytes32 key, string calldata value) external onlyOwner {
        _configString[key] = value;
        emit ConfigSetString(key, value);
    }
}