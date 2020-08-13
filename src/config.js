export const config = {
    rinkeby: {
        contractAddress: '0x304438f8b26ADE29187B2192E89a2f8cb61E871F',
        websocketProviderUrl: 'wss://rinkeby.infura.io/ws/v3/357ce0ddb3ef426ba0bc727a3c64c873',
        isTrezorEnabled: false,
        isMetamaskEnabled: true
    },
    mainnet: {
        // todo set mainnet contract
        contractAddress: '',
        websocketProviderUrl: 'wss://mainnet.infura.io/ws/v3/357ce0ddb3ef426ba0bc727a3c64c873',
        isTrezorEnabled: false
    }
};

export function getConfig(network) {
    if (!config[network]) {
        throw new Error(`Config for this network not found: ${network}`);
    }

    return config[network];
}
