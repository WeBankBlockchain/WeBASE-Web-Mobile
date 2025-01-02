import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { Collapse } from 'antd-mobile'
import { useTranslation } from "react-i18next";
import { RulesCollpseBox } from './RulesCollapseStyle'


interface RulesCollapseProps {
    children?: ReactNode | ReactNode[]

}

function RulesCollapse({ children, }: RulesCollapseProps) {

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
        <RulesCollpseBox  className='rules-collapse-page'>
            <Collapse
                className='rules-collapse'
                arrowIcon={
                    <img style={{  width: '16px', height: '16px' }} src={process.env.PUBLIC_URL + '/icons/solid-arrow-down.svg'}></img>
               }
            >
                <Collapse.Panel 
                key='1'  
                title={
                    <div style={{fontSize: '14px', lineHeight: '24px', color: '#414C63', fontWeight: '500'}}>{t('event_rules')}</div>
                }
               
                arrowIcon={
                     <img style={{  width: '16px', height: '16px' }} src={process.env.PUBLIC_URL + '/icons/solid-arrow-down.svg'}></img>
                }>
                    {
                        rulesText.map((item: any, index: number) => {
                            return (
                                <div className='rules-item' key={index}>
                                    <div className="rules-type">{item.title}</div>
                                    {
                                        item.content.map((_item: any, _index: number) => {
                                            return (
                                                <div className='value-item' key={_index}>
                                                    <div className="text-index">{_item.key}.</div>
                                                    <div className="text-content" dangerouslySetInnerHTML={{ __html: _item.value }}></div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </Collapse.Panel>
            </Collapse>
        </RulesCollpseBox>
    )
}

export default RulesCollapse
