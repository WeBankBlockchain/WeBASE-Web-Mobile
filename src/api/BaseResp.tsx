export interface BaseResp<T> {
    code: number,
    message: string,
    data: T,
    bizSeqNo: string,
    success: boolean
}