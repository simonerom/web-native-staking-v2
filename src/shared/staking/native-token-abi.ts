export const NATIVE_TOKEN_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_pyggIndex",
        type: "uint256",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_canName",
        type: "bytes12",
      },
      {
        name: "_stakeDuration",
        type: "uint256",
      },
      {
        name: "_nonDecay",
        type: "bool",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "createPygg",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maxPyggsPerAddr",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "addrs",
        type: "address[]",
      },
    ],
    name: "removeAddressesFromWhitelist",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "addr",
        type: "address",
      },
    ],
    name: "removeAddressFromWhitelist",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address",
      },
    ],
    name: "isOwner",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "stakeholders",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "minStakeDuration",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "secondsPerDay",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_prevIndex",
        type: "uint256",
      },
      {
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getActivePyggCreateTimes",
    outputs: [
      {
        name: "count",
        type: "uint256",
      },
      {
        name: "indexes",
        type: "uint256[]",
      },
      {
        name: "createTimes",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pyggIndex",
        type: "uint256",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "storeToPygg",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maxStakeDuration",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pyggIndex",
        type: "uint256",
      },
      {
        name: "_stakeDuration",
        type: "uint256",
      },
      {
        name: "_nonDecay",
        type: "bool",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "restake",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "addr",
        type: "address",
      },
    ],
    name: "addAddressToWhitelist",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pyggIndex",
        type: "uint256",
      },
      {
        name: "_newOwner",
        type: "address",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "transferOwnershipOfPygg",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalStaked",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_prevIndex",
        type: "uint256",
      },
      {
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getActivePyggIdx",
    outputs: [
      {
        name: "count",
        type: "uint256",
      },
      {
        name: "indexes",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
    ],
    name: "whitelist",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "unStakeDuration",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pyggIndex",
        type: "uint256",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "unstake",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "pyggs",
    outputs: [
      {
        name: "canName",
        type: "bytes12",
      },
      {
        name: "stakedAmount",
        type: "uint256",
      },
      {
        name: "stakeDuration",
        type: "uint256",
      },
      {
        name: "stakeStartTime",
        type: "uint256",
      },
      {
        name: "nonDecay",
        type: "bool",
      },
      {
        name: "unstakeStartTime",
        type: "uint256",
      },
      {
        name: "pyggOwner", // bucketOwner field of buckets method response in STAKING_ABI
        type: "address",
      },
      {
        name: "createTime",
        type: "uint256",
      },
      {
        name: "prev",
        type: "uint256",
      },
      {
        name: "next",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "getPyggIndexesByAddress",
    outputs: [
      {
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pyggIndex",
        type: "uint256",
      },
      {
        name: "_canName",
        type: "bytes12",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "revote",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_prevIndex",
        type: "uint256",
      },
      {
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getActivePyggs",
    outputs: [
      {
        name: "count",
        type: "uint256",
      },
      {
        name: "indexes",
        type: "uint256[]",
      },
      {
        name: "stakeStartTimes",
        type: "uint256[]",
      },
      {
        name: "stakeDurations",
        type: "uint256[]",
      },
      {
        name: "decays",
        type: "bool[]",
      },
      {
        name: "stakedAmounts",
        type: "uint256[]",
      },
      {
        name: "canNames",
        type: "bytes12[]",
      },
      {
        name: "owners",
        type: "address[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "addrs",
        type: "address[]",
      },
    ],
    name: "addAddressesToWhitelist",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "minStakeAmount",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_minStakeAmount",
        type: "uint256",
      },
      {
        name: "_maxPyggsPerAddr",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "pyggIndex",
        type: "uint256",
      },
      {
        indexed: false,
        name: "canName",
        type: "bytes12",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "stakeDuration",
        type: "uint256",
      },
      {
        indexed: false,
        name: "stakeStartTime",
        type: "uint256",
      },
      {
        indexed: false,
        name: "nonDecay",
        type: "bool",
      },
      {
        indexed: false,
        name: "pyggOwner",
        type: "address",
      },
      {
        indexed: false,
        name: "data",
        type: "bytes",
      },
    ],
    name: "PyggCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "pyggIndex",
        type: "uint256",
      },
      {
        indexed: false,
        name: "canName",
        type: "bytes12",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "stakeDuration",
        type: "uint256",
      },
      {
        indexed: false,
        name: "stakeStartTime",
        type: "uint256",
      },
      {
        indexed: false,
        name: "nonDecay",
        type: "bool",
      },
      {
        indexed: false,
        name: "pyggOwner",
        type: "address",
      },
      {
        indexed: false,
        name: "data",
        type: "bytes",
      },
    ],
    name: "PyggUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "pyggIndex",
        type: "uint256",
      },
      {
        indexed: false,
        name: "canName",
        type: "bytes12",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "data",
        type: "bytes",
      },
    ],
    name: "PyggUnstake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "pyggIndex",
        type: "uint256",
      },
      {
        indexed: false,
        name: "canName",
        type: "bytes12",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "data",
        type: "bytes",
      },
    ],
    name: "PyggWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "addr",
        type: "address",
      },
    ],
    name: "WhitelistedAddressAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "addr",
        type: "address",
      },
    ],
    name: "WhitelistedAddressRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Pause",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Unpause",
    type: "event",
  },
];
export const COMPOUND_INTEREST_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "buckets",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "registrants",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "int256",
        name: "bucketId",
        type: "int256",
      },
    ],
    name: "register",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unregister",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "bucket",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
