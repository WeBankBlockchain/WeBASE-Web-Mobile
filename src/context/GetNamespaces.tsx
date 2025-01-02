import { ProposalTypes } from "@walletconnect/types";

enum DEFAULT_EIP_155_EVENTS {
    ETH_CHAIN_CHANGED = "chainChanged",
    ETH_ACCOUNTS_CHANGED = "accountsChanged",
}

export const DEFAULT_EIP155_OPTIONAL_METHODS = {
    ETH_SIGN_TRANSACTION: "eth_signTransaction",
    ETH_SIGN: "eth_sign",
    ETH_SIGN_TYPED_DATA: "eth_signTypedData",
    ETH_SIGN_TYPED_DATA_V4: "eth_signTypedData_v4",
} as const;

const DEFAULT_EIP5792_METHODS = {
    WALLET_GET_CAPABILITIES: "wallet_getCapabilities",
    WALLET_SEND_CALLS: "wallet_sendCalls",
    WALLET_GET_CALLS_STATUS: "wallet_getCallsStatus",
} as const;

export const DEFAULT_EIP155_METHODS = {
    ETH_SEND_TRANSACTION: "eth_sendTransaction",
    PERSONAL_SIGN: "personal_sign",
};

const DEFAULT_OPTIONAL_METHODS = {
    ...DEFAULT_EIP155_OPTIONAL_METHODS,
    ...DEFAULT_EIP5792_METHODS,
};


const getNamespacesFromChains = (chains: string[]) => {
    const supportedNamespaces: string[] = [];
    chains.forEach((chainId) => {
        const [namespace] = chainId.split(":");
        if (!supportedNamespaces.includes(namespace)) {
            supportedNamespaces.push(namespace);
        }
    });
    return supportedNamespaces;
};

export const getRequiredNamespaces = (chains: string[]): ProposalTypes.RequiredNamespaces => {
    const selectedNamespaces = getNamespacesFromChains(chains);
    console.log("selected required namespaces:", selectedNamespaces);
    return Object.fromEntries(
        selectedNamespaces.map((namespace) => [
            namespace,
            {
                methods: Object.values(DEFAULT_EIP155_METHODS),
                chains: chains.filter((chain) => chain.startsWith(namespace)),
                events: Object.values(DEFAULT_EIP_155_EVENTS) as any[],
            },
        ])
    );
};

export const getOptionalNamespaces = (chains: string[]): ProposalTypes.OptionalNamespaces => {
    const selectedNamespaces = getNamespacesFromChains(chains);
    console.log("selected optional namespaces:", selectedNamespaces);
    return Object.fromEntries(
        selectedNamespaces.map((namespace) => [
            namespace,
            {
                methods: Object.values(DEFAULT_OPTIONAL_METHODS),
                chains: chains.filter((chain) => chain.startsWith(namespace)),
                events: [],
            },
        ])
    );
};
