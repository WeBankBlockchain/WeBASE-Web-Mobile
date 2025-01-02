import styled from 'styled-components';


export const GuidePage = styled.div`

    width: 100%;
    height: auto;
    /* min-height: 100vh; */
    background-color: #184CCC;

    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat; 

    box-sizing: border-box;

    padding-bottom: 42px;
 

    .banner{
        width: 100%;
    }


    .banner-title{
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 30px;
        margin: 8px auto;
        text-align: center;
    }

    .banner-sub-title{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        text-align: center;
        margin-bottom: 20px;
    }


    .mask{
        position: fixed;
        opacity: 0.9;
        background: #192134;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 998;


        .jump-tip-text{
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 24px;
            position: absolute;
            top: 98px;
            right: 104px;
        }
        .jump-tip-icon{
            width: 70px;
            height: 86px;
            position: absolute;
            top: 24px;
            right: 24px;
        }
    }

















`