declare module 'global' {
    global {
        interface Window {
            ethereum?: any;
            mina?: any;
            keplr: {
                enable: (chainId: string) => Promise<void>;
                getOfflineSigner: (chainId: string) => any;
            };
            getOfflineSigner: (chainId: string) => any;
        }
    }
}