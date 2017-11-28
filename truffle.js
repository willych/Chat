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
      from: "0x86F2d845DFf162FcA15cbb6E247D3FfE12709784",
      network_id: 4,
      gas: 4600000
    }
  }
};
