export const getStdAddress = (account: string | undefined): string => {
    if (account && account.length > 8) {
        return account.slice(0, 6) + "..." + account.slice(account.length - 4, account.length)
    } else {
        return account ? account : ''
    }
}