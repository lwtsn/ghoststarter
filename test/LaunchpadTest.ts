import {getBlockTime, getProvider, wait} from './helpers/contract';
import {deployContract, deployMockContract, MockContract} from 'ethereum-waffle';
import {BigNumber} from 'ethers';
import {Erc20, Launchpad} from "../typechain";
import LaunchpadArtifact from "../artifacts/contracts/Launchpad.sol/Launchpad.json";
import Erc20Artifact from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import {oneEther} from "./helpers/numbers";

const [alice, bob] = getProvider().getWallets();

describe('Launchpad', () => {
    let launchpad: Launchpad;
    let bobConnectedLaunchpad: Launchpad;

    let token: Erc20 | MockContract;

    const tokenValueInWei = BigNumber.from(10).pow(10); // 10^10 = 10 trillion or 0.00000001 ETH
    const tokensForSale = oneEther.mul(1000000); // 1 million

    const individualMinimumAmount = oneEther.mul(50);
    const individualMaximumAmount = oneEther.mul(50000); // 50k
    const minimumTokensToBeSold = oneEther.mul(100000); // 100k

    const isTokenSwapAtomic = true;
    const feeAmount = 10;
    const isWhitelisted = true;

    beforeEach(async () => {
        const startDate = await getBlockTime() + 10;
        const endDate = await getBlockTime() + 604800 // one week;

        token = await deployMockContract(alice, Erc20Artifact.abi);
        await token.mock.decimals.returns(18)

        launchpad = await deployContract(
            alice,
            LaunchpadArtifact,
            [
                token.address,
                tokenValueInWei,
                tokensForSale,
                startDate,
                endDate,
                individualMinimumAmount,
                individualMaximumAmount,
                isTokenSwapAtomic,
                minimumTokensToBeSold,
                feeAmount,
                isWhitelisted
            ]
        ) as Launchpad;

        bobConnectedLaunchpad = await launchpad.connect(bob)
    });

    describe('Swap', async () => {
        it('Should allow payment to be made in exchange for tokens', async () => {
            // Add bob to whitelist
            await launchpad.add([bob.address]);

            await token.mock.transferFrom.withArgs(alice.address, launchpad.address, tokensForSale).returns(true)
            await token.mock.balanceOf.returns(tokensForSale)

            await launchpad.fund(tokensForSale)

            await wait(3600)

            await bobConnectedLaunchpad.swap(oneEther.mul(50000))
        });
    });
});
