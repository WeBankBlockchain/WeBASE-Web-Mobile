import { SessionTypes } from '@walletconnect/types';
import { SignClientV2 } from './SignClient';
import { printLog } from './LogTools';


export interface SessionData {
    session: SessionTypes.Struct;
    chains: string[];
    accounts: string[]
}

export function getSessionData(_session: SessionTypes.Struct): SessionData {

    const allNamespaceAccounts = Object.values(_session.namespaces).map((namespace) => namespace.accounts).flat();
    const allNamespaceChains = Object.keys(_session.namespaces);

    return { session: _session, chains: allNamespaceChains, accounts: allNamespaceAccounts }
}

export function getLastSession(client: SignClientV2 | undefined) {
    if (client === undefined) {
        return undefined;
    }
    if (client.session.length) {
        const lastKeyIndex = client.session.keys.length - 1;
        const _session = client.session.get(client.session.keys[lastKeyIndex]);
        return getSessionData(_session);
    } else {
        return undefined;
    }
}

export function disConn(client: SignClientV2 | undefined, session: SessionData | undefined) {
    if (client === undefined || session === undefined) {
        return false;
    }
    printLog("do disconn-->topic=" + session.session.topic)
    try {
        client.disconnect({ topic: session.session.topic, reason: { message: "h5 disconnect", code: -1 } })
    } catch (error) {
        printLog(["do disconn-->error=" + error])
    }
}