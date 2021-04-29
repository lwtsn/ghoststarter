import {deployContract, MockProvider} from 'ethereum-waffle';

import {Signer} from 'ethers';
import LaunchpadArtifact from "../../artifacts/contracts/Launchpad.sol/Launchpad.json";
import {Launchpad} from "../../typechain/Launchpad";

let provider: MockProvider;

export function getProvider() {
    if (provider == undefined) {
        provider = new MockProvider();
    }
    return provider;
}

export async function mineBlock() {
    await getProvider().send('evm_mine', []);
}

export async function wait(secondsToWait: number) {
    // Update the clock
    await getProvider().send('evm_increaseTime', [secondsToWait]);

    // Process the block
    await mineBlock();
}

export async function getBlockTime() {
    return await getProvider()
        .getBlock(getBlockNumber())
        .then((block) => block.timestamp);
}

export async function getBlockNumber() {
    return await getProvider().getBlockNumber();
}
