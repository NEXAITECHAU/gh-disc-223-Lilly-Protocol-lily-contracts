// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

contract ConfigView {
    // Mapping from config key to value (stored as bytes32)
    mapping(bytes32 => bytes32) private _config;

    /**
     * @dev Returns the config value for a given key.
     * Reverts if the key is not set (value is zero).
     */
    function getConfigValue(bytes32 key) external view returns (bytes32) {
        bytes32 value = _config[key];
        require(value != 0, "Config: key not set");
        return value;
    }

    /**
     * @dev Returns the config value for a given key, or a default value if not set.
     */
    function getConfigOrDefault(bytes32 key, bytes32 defaultValue) external view returns (bytes32) {
        bytes32 value = _config[key];
        return value == 0 ? defaultValue : value;
    }

    /**
     * @dev Sets a config value (internal use only, for completeness).
     */
    function _setConfig(bytes32 key, bytes32 value) internal {
        _config[key] = value;
    }
}