

export const DEFAULT_PROJECT_ID = '92c985baed5b92f7af0f7296db111546';

export const DEFAULT_APP_METADATA = {
    name: "Admission Ticket",
    description: "Exclusive AIGC Ticket to WeBank",
    icons: [window.location.origin + process.env.PUBLIC_URL + '/logo.png'],
};

export const DEFAULT_CHAINIDS = "bcos:1"

export const CONN_STSTUS = {
    noConn: 0,
    connInit: 1,
    conning: 2,
    connected: 3,
    connectError: 4,
} as const;

export const tokenkey = "hk_ecc_token"

export const isDID = true

export const isAutoConn = false;

export const WCTimeout = 10000

export const isHKEnv = true

export const DEFAULT_LOGGER = isHKEnv ? "info" : "trace";