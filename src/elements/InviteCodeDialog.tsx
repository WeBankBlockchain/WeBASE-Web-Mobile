import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { Button, Modal, Input, InputRef } from 'antd-mobile'
import { Receive } from '../api/Receive'
import { useClientContext } from '../context/ClientContext';
import { GetToken, ShowToast } from '../tools/CommonUtils';
import { BaseResp } from '../api/BaseResp';
import { AssetInfo } from '../api/AssetInfo';
import { useTranslation } from "react-i18next";
import { isAndroid } from '../tools'
import './InviteCodeDialog.css'


interface InviteCodeDialogProps {
    children?: ReactNode | ReactNode[]
    show: boolean
    loading?: boolean
    onOk: (inputValue: string | any) => void
    onCancel: () => void,
}


function InviteCodeDialog({ children, show, onOk, onCancel }: InviteCodeDialogProps) {

    const { t } = useTranslation();


    const { currentJwt } = useClientContext()

    const [inputValue, setInputValue] = useState<string>('')

    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [inputStatus, setInputStatus] = useState<string>('')


    useEffect(() => {
        if (show) {
            // setTimeout(() => {
            //     handleFocus()
            // },100)

        } else {
            setInputValue('')
            setLoading(false)
            setBtnDisabled(true)
            setInputStatus('')
        }

    }, [show])

    useEffect(() => {
        if (inputValue && inputValue.length >= 6) {
            setBtnDisabled(false)
        } else {
            setBtnDisabled(true)
        }

    }, [inputValue])



    const handleConfirm = () => {
        if (loading) return
        setLoading(true)
        const currentToken = GetToken();
        getReceive()


    }

    const getReceive = async () => {
        const currentToken = GetToken();
        Receive( async (resp: BaseResp<AssetInfo> | undefined) => {
            setLoading(false)
            if (!resp) {
                setInputStatus(t('network_error'))
                return
            }
            if (resp?.code === 0) {
                console.log('get receive success',resp);
                
                onOk(resp)

            } else {
                setInputStatus(resp?.message || t('network_error'))
            }

        },
            currentJwt?.openTicketAddress || '',
            currentToken?.token,
            inputValue
        )

    }

    const inputRef = useRef<InputRef | any>(null);
    const changeInviteCode = (v: string) => {
        console.log('value', v);

        if (v === '' || /^\d{0,6}$/.test(v)) {
            setInputStatus('')
            setInputValue(v)
        }
    }

  
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const onFocus = (v: any) => {
        setIsFocus(true)
    }

    const onBlur = (v: any) => {
        setIsFocus(false)
    }


    const handleFocus = () => {
        if(inputRef.current){
            inputRef.current.focus()            
        }
    }




    return (
        <div className="invite-code-dialog">
            <Modal
                visible={show}
                onClose={onCancel}
                closeOnMaskClick
                showCloseButton={false}
                bodyClassName='invite-code-modal'
                content={
                    <>
                        <div className="dialog-title">Enter Claim Code</div>


                        {/* type=number，max在失焦时输入框值会变为max的值！！！ maxLength不生效，这里在onChange进行限制 */}
                        <Input
                            ref={inputRef}
                            className={
                                `invite-code-input ${inputStatus ? 'invite-code-input-status' : ''} ${isFocus ? 'invite-code-input-focus' : ''}`
                            }
                            style={{
                                '--color': isFocus ? '#2da1ff' :  inputStatus ? '#FF3561' : '#2da1ff'
                            }}
                            // type={isAndroid() ? 'number' : 'text' }                         
                            type="tel"                         
                            maxLength={6}
                            placeholder='Enter 6-digit number'
                            value={inputValue}
                            onChange={changeInviteCode}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        <div className="input-status" style={{ opacity: inputStatus ? 1 : 0 }}>{inputStatus}</div>

                        <div className="btn-units">

                            <Button className='sub-btn' onClick={onCancel}>{t('cancel')}</Button>
                            <Button disabled={btnDisabled || loading} loading={loading} className='main-btn' onClick={handleConfirm}>{t('confirm')}</Button>
                        </div>
                    </>
                }
            />

        </div>

    )
}

export default InviteCodeDialog
