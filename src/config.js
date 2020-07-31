export const config = {
    rinkeby: {
        websocketProviderUrl: 'wss://rinkeby.infura.io/ws/v3/357ce0ddb3ef426ba0bc727a3c64c873',
        isTrezorEnabled: false
    }
    // todo add mainnet config
};

export function getConfig(network) {
    return config[network];
}
