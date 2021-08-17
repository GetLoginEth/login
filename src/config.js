import GetLoginStorage from './smart/build/contracts/GetLoginStorage.out.json';
import GetLoginLogic from './smart/build/contracts/GetLoginLogic.out.json';

export function getConfig(network) {
    const config = JSON.parse(process.env.REACT_APP_NETWORKS);

    if (!config[network]) {
        throw new Error(`Config for this network not found: ${network}`);
    }

    const result = config[network];

    return {
        ...result,
        logicContractNetwork: GetLoginLogic.networks[result.id],
        storageContractNetwork: GetLoginStorage.networks[result.id],
    };
}
