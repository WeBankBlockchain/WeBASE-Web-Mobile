import React, { useState, useEffect } from 'react'
import {  Button } from 'antd-mobile'
import { useLocation } from 'react-router-dom'

import ProgressSteps from '../../elements/Steps'
import styled from 'styled-components';
import { GuidePage } from './indexStyle'
import { isWeixinOrWxWork, isAndroid } from '../../tools/index'
import { useTranslation } from "react-i18next";

const StepsItemBox = styled.div`
    width: 100%;
    background-color: #EFF8FF;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 12px;
    margin-top: 12px;
`;


export default function Guide() {
    const { t } = useTranslation();
 
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')

    const [inviteCode, setinviteCode] = useState<string>('123456')
    const [showMask, setShowMask] = useState<boolean>(false)
    // https://apps.apple.com/app/beanbag%E5%91%98%E5%B7%A5%E7%89%88/id6483943674
    // https://apps.apple.com/cn/app/beanbag%E5%91%98%E5%B7%A5%E7%89%88/id6483943674
    // https://apps.apple.com/us/app/beanbag%E5%91%98%E5%B7%A5%E7%89%88/id6483943674
    const appStoreUrl: string = 'https://apps.apple.com/us/app/beanbag%E5%91%98%E5%B7%A5%E7%89%88/id6483943674'
    const androidUrl: string = 'https://occ.webankcdn.net/wbbc-cdnps/beanbag/BeanBag_latest.apk'

    const schemeUrl: string = 'beanbag://'

    useEffect(() => {
        if(code){
            setinviteCode(code)
        } else {

        }
    },[code]) 


    const downloadApp = () => {
        if(isWeixinOrWxWork()){
            setShowMask(true)
        } else if(isAndroid()){
            console.log('to android');
            
            window.location.href = androidUrl
        } else {
            console.log('to ios');
            window.location.href = appStoreUrl
        }
    }

    const closeMask = () => {
        setShowMask(false)
    }

    const steps: any[] = [
        {
            title: t('guide_steps_1_title'),
            icon: <img style={{ width: "24px", height: '24px' }} src={process.env.PUBLIC_URL + '/icons/guide/step1-icon.png'} />,
            description: (
                <>


                    <StepsItemBox style={{position: 'relative', }} >
                        <div style={{marginBottom: '24px'}}>{t('guide_steps_1_content_1')}</div>
                        <img style={{ width: "100%", height: 'auto',marginTop: '-30px' }} src={process.env.PUBLIC_URL + '/icons/guide/step1.png'} />

                        <div style={{
                            position: 'absolute',
                            left: '0px',
                            right: '0px',
                            bottom: '0px',
                            boxSizing: 'border-box',
                            padding: '28px 16px',
                        }}>
                            <Button style={{
                                border: 'none',
                                height: '46px',

                                '--background-color': '#2DA1FF',
                                '--border-radius': '8px',
                                '--text-color': '#FFFFFF',
                            }}
                            block
                            onClick={downloadApp}
                            >
                                <div   style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img style={{ width: "16px", height: '16px', marginRight: '8px' }} src={process.env.PUBLIC_URL + '/icons/down-icon.svg'} />
                                    <div>{t('download_now')}</div>
                                </div>
                            </Button>

                        </div>
                    </StepsItemBox>

                </>
            ),
            completed: true
        },
        {
            title: t('guide_steps_2_title'),
            icon: <img style={{ width: "24px", height: '24px' }} src={process.env.PUBLIC_URL + '/icons/guide/step2-icon.png'} />,
            description: (
                <>
                    <StepsItemBox >
                        <div style={{marginBottom: '24px'}}>{t('guide_steps_2_content_1')}</div>
                       

                        <img style={{ width: "100%", height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/guide/step2.png'} />
                    </StepsItemBox>
                </>
            ),
            completed: true
        },
        {
            title: t('guide_steps_3_title'),
            icon: <img style={{ width: "24px", height: '24px' }} src={process.env.PUBLIC_URL + '/icons/guide/step3-icon.png'} />,
            description: (
                <>
                    <StepsItemBox>
                        <div style={{marginBottom: '12px'}}>{t('guide_steps_3_content_1')}</div>
                        <img style={{ width: "100%", height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/guide/step31.png'} />

                    </StepsItemBox>
                    <StepsItemBox>
                        <div style={{fontSize: '14px', color: '#414C63', lineHeight: '24px',marginBottom: '4px'}}>{t('guide_steps_3_content_2')}</div>
                        <div style={{fontWeight: 'bold',  fontSize: '14px', color: '#0F121E', lineHeight: '24px',marginBottom: '12px'}}>{t('guide_steps_3_content_3')}<span style={{color: '#2DA1FF'}}>{inviteCode}</span></div>
                        <img style={{ width: "100%", height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/guide/step32.png'} />
                    </StepsItemBox>
                </>
            ),
            completed: true
        }
    ];



    return (
        <GuidePage className='guide-page' >
            <div className="banner">
                <img style={{ width: "100%", height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/guide/guide-bg.png'} />
            </div>

            <ProgressSteps steps={steps} />


            {
                showMask && <div className="mask" onClick={closeMask}>
                    <div className='jump-tip-text'>Please open your browser</div>
                    <img className='jump-tip-icon' src={ process.env.PUBLIC_URL + '/icons/guide/jump-tip.png'} alt="" />
                    
                </div>
            }


            


        </GuidePage>
    )
}
