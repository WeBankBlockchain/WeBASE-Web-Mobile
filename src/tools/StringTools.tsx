import { printLog } from "../context/LogTools"

export const getStdAddress = (account: string | undefined): string => {
    if (account && account.length > 8) {
        return account.slice(0, 6) + "..." + account.slice(account.length - 4, account.length)
    } else {
        return account ? account : ''
    }
}

export const getMastName = (name: string | null): string => {
    printLog("getMastName-->" + name)
    if (!name) {
        return ""
    }
    name = name.trim()
    if (name.includes(' ')) {
        const names = name.split(' ')
        name = '****' + names[names.length - 1]
    }
    return name;
}