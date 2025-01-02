import styled from 'styled-components';

export const WellcomePageBox = styled.div`
    width: 100%;
    height: 100%;
    background-color: #2253b3;
    background-image: url(${process.env.PUBLIC_URL + '/icons/index-bg.jpg'});
    background-size: cover;
    background-position: center; 
    background-repeat: no-repeat; 


    position: relative;
    box-sizing: border-box;
    padding: 12vh 35px 0;

    @media (min-width: 500px) {
        background-image: url(${process.env.PUBLIC_URL + '/icons/index-bg-pc.jpg'});
    }

    .rules-btn {
        position: absolute;
        top: 12px;
        right: 16px;

        background: rgba(255, 255, 255, 0.2);
        border-radius: 27px;

        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #ffffff;
        line-height: 20px;
        border: none;
    }

    .tip-title {
        font-size: 40px;
        font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
        font-weight: bold;
        color: #ffffff;
        line-height: 49px;
        text-align: center;
    }

    .tip-sub-text {
        font-size: 20px;
        font-family: AlibabaPuHuiTi-Light, AlibabaPuHuiTi;
        font-weight: 300;
        color: #ffffff;
        line-height: 22px;
        text-align: center;
    }


    .claim-btn {
        width: calc(100vh - 70px);
        max-width: calc(320px - 70px);
        height: 56px;
        position: absolute;
        bottom: 11.4vh;
        left: 50%;
        transform: translateX(-50%);
        /* 背景图之外的为透明背景 */
        background-color: transparent;
      

        background-image: url(${process.env.PUBLIC_URL + '/icons/claim-btn.png'});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: none;



        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #00013E;
        line-height: 22px;
    }

`