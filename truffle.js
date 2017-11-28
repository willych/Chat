module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4600000
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: 4
    }
  }
};
