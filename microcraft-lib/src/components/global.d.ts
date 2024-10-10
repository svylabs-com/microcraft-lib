declare module 'global' {
    global {
        interface Window {
            keplr: {
                enable: (chainId: string) => Promise<void>;
                getOfflineSigner: (chainId: string) => any;
            };
            getOfflineSigner: (chainId: string) => any;
        }
    }
}