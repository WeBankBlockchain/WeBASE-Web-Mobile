import { getAppMetadata } from "@walletconnect/utils";
import { getOptionalNamespaces } from "./GetNamespaces";
import { printLog } from "./LogTools";
import { DEFAULT_APP_METADATA, DEFAULT_CHAINIDS, DEFAULT_LOGGER, DEFAULT_PROJECT_ID } from "./Const";
import { SignClientV2, SignClientV2Ins } from "./SignClient";
import { JWTInfo } from "../api/GetJwt";


export async function createClient(jwtInfo: JWTInfo) {
    printLog('createClient')
    printLog(["jwt", jwtInfo])
    printLog(["icon", DEFAULT_APP_METADATA.icons])
    try {
        const _client = SignClientV2Ins.init({
            logger: DEFAULT_LOGGER,
            relayUrl: jwtInfo.relayUrl,
            projectId: DEFAULT_PROJECT_ID,
            metadata: {
                ...DEFAULT_APP_METADATA,
                url: getAppMetadata().url,
            },
            backendJWT: jwtInfo.jwt,
        });
        return _client;
    } catch (err) {
        throw err;
    }
}

export async function connect(client: SignClientV2, onGetUri: (uri: string) => void) {
    try {

        const optionalNamespaces = getOptionalNamespaces([DEFAULT_CHAINIDS]);
        const { uri, approval } = await client.connect({
            pairingTopic: undefined,
            requiredNamespaces: {
                bcos: {
                    methods: ["personal_sign", "eth_signTransaction"],
                    chains: [DEFAULT_CHAINIDS],
                    events: ["chainChanged", "accountsChanged"]
                }
            },
            optionalNamespaces,
        });
        printLog(["get uri", uri])
        if (uri) {

            onGetUri(uri)
        }

        const _session = await approval();
        printLog(["Established session:", _session]);
        return { session: _session, pairings: client.pairing.getAll({ active: true }) }

    } catch (err) {
        printLog(["wait scan error!!!", err])
    } finally {
        printLog("wait scan finish!!!")
    }
}