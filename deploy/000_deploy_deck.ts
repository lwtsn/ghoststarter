import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {GHOST_STARTER} from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy, log} = deployments;

    const {deployer} = await getNamedAccounts();

    log('Deploying Ghost Starter Token Contract from ' + deployer + "....");
    await deploy(GHOST_STARTER, {
      from: deployer,
      log: true,
    });
};

export default func;

func.tags = [DECK];
