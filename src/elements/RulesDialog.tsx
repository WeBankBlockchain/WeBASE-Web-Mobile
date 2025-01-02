import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { Button, Modal, Input, Popup } from 'antd-mobile'
import { useTranslation } from "react-i18next";
import './RulesDialog.css'


interface RulesDialogProps {
    children?: ReactNode | ReactNode[]
    show: boolean
    onClose: () => void,
}


function RulesDialog({ children, show, onClose }: RulesDialogProps) {
    const { t } = useTranslation();





    const rulesText:any = [
        {
            title: t('rules_main_title'),
            content: [
                {
                    key: '1',
                    value: t('rules_main_text_1'),
                },
                {
                    key: '2',
                    value: t('rules_main_text_2'),
                },
                {
                    key: '3',
                    value: t('rules_main_text_3'),
                },
            ]
        },

    ]



    return (

        <Popup
            className='rules-dialog'
            bodyClassName='rules-dialog-content'
            closeOnMaskClick={true}
            position="bottom"
            visible={show}
            onClose={onClose}
            bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                minHeight: '50vh',
            }}
        >

            <div className='dialog-buoy'></div>
            <div className="dialog-title">{t('event_rules')}</div>

            {
                rulesText.map((item:any, index:number) => {
                    return (
                        <div className='rules-item' key={index}>
                            <div className="rules-type">{item.title}</div>
                            {
                                item.content.map((_item:any,_index:number) => {
                                    return (
                                        <div className='value-item' key={_index}>
                                            <div className="text-index">{_item.key}.</div>
                                            <div className="text-content" dangerouslySetInnerHTML={{__html: _item.value}}></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </Popup>



    )
}

export default RulesDialog
