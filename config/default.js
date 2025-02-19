const { config } = require("dotenv");
config();

module.exports = {
  project: "web-native-staking-v2",
  server: {
    proxy: true,
    routePrefix: "",
    port: process.env.PORT || 5004,
    staticDir: "./dist",
    delayInitMiddleware: true,
    cookie: {
      secrets: ["insecure plain text", "insecure secret here"],
    },
    noSecurityHeadersRoutes: {
      "/v2/api-gateway/": true,
      "/api/": true,
    },
    noCsrfRoutes: {
      "/v2/api-gateway/": true,
      "/api/": true,
      "/iotex-core-proxy/": true,
    },
  },
  ssm: {
    enabled: false,
  },
  gateways: {
    logger: {
      enabled: true,
      level: "debug",
    },
    mongoose: {
      enabled: true,
      debug: false,
      uri: process.env.MONGODB_URI,
      connectTimeoutMS: 5000,
    },
    staking: {
      delegateProfileContractAddr: "io1lfl4ppn2c3wcft04f0rk0jy9lyn4pcjcm7638u",
      compoundInterestContractAddr: "io108ckwzlzpkhva7cnfceajlu7wu6ql5kq95uat9",
    },
  },
  analytics: {
    googleTid: "TODO: replace with your googleTid",
  },
  csp: {
    "default-src": ["none"],
    "manifest-src": ["self", "https://web-native-staking-v2.b-cdn.net/"],
    "style-src": [
      "self",
      "unsafe-inline",
      "https://fonts.googleapis.com/css",
      "https://web-native-staking-v2.b-cdn.net/",
    ],
    "frame-src": [
      "https://disqus.com/",
      "https://wvjb-queue-message/",
      "https://bridge-loaded/",
      "yy://jb-queue-message/",
    ],
    "connect-src": [
      "self",
      "https://www.google-analytics.com/",
      "https://member.iotex.io/api-gateway/",
      "https://web-bp-testnet.herokuapp.com/api-gateway/",
      "wss://local.iotex.io:64102/",
      "https://member.iotex.io/iotex-core-proxy/",
      "https://api.nightly-cluster-2.iotex.one/",
      "https://api.testnet.iotex.one/",
      "https://api.iotex.one/",
      "https://api.cloudinary.com/",
      "https://analytics.iotexscan.io/query",
      "https://iotexscan.io/api-gateway/",
      "https://web-native-staking-v2.b-cdn.net/",
      "https://c.disquscdn.com/",
      "https://disqus.com/",
      ...(process.env.API_GATEWAY_URL ? [process.env.API_GATEWAY_URL] : []),
    ],
    "child-src": ["self"],
    "font-src": ["self", "data:", "https://fonts.gstatic.com/"],
    "img-src": ["*", "data:"],
    "media-src": ["self"],
    "object-src": ["self"],
    "script-src": [
      "self",
      "https://www.google-analytics.com/",
      "unsafe-eval",
      "https://web-native-staking-v2.b-cdn.net/",
      "https://iotexmember.disqus.com/embed.js",
      "https://c.disquscdn.com/",
      "https://disqus.com/",
    ],
  },
  apiGatewayUrl:
    process.env.API_GATEWAY_URL || "http://localhost:5004/v2/api-gateway/",
  iotexCore: "https://api.iotex.one",
  easterHeight: "4478761",
  webBp: "https://member.iotex.io/api-gateway/",
};
