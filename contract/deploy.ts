import { toNano } from '@ton/core';
import { AirRewards } from './wrappers/AirRewards';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const airRewards = provider.open(await AirRewards.fromInit());

    await airRewards.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(airRewards.address);

    console.log('Contract deployed at:', airRewards.address);
}