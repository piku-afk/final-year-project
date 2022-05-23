const ElectionFactory = artifacts.require('ElectionFactory');

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(ElectionFactory);
};
