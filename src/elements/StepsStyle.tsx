import styled from 'styled-components';

export const ProgressStepsBox = styled.div`
    width: calc(100% - 36px);
    margin: auto ;
    box-sizing: border-box;
    padding: 18px;
    border-radius: 16px;
    transform: translateY(-106px);
    /* background: linear-gradient(180deg, #E3F1FF 0%, #FFFFFF 100%); */
    background: #FFFFFF;

    @media (min-width: 500px) {
        transform: translateY(-150px);
    }

    .step{
        width: 100%;
        display: flex;
        margin-bottom: 8px;
        
        .step-left{
           width:24px;
           display: flex;
           flex-direction: column;
           align-items: center;
           margin-right: 8px;

            .step-index{
                width: 24px;
                height: 24px;
                margin-bottom: 8px;
                /* border-radius: 50%;
                background-color: #2DA1FF;
                text-align: center;

                font-size: 16px;
                font-family: Facto-Bold, Facto;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 24px; */


            }
            .step-line{
                /* 虚线 */
                width: 1px;
                flex: 1;
                background: repeating-linear-gradient(to bottom, #2DA1FF, #2DA1FF 4px, transparent 4px,transparent 10px);
            }
        }

     

        .step-right{
            flex: 1;


            .title{
                font-size: 16px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #0F121E;
                line-height: 24px;
            }

            .description{
                
                margin-top: 4px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #414C63;
                line-height: 24px;
            }


        }


    }

    .step:last-child .step-line{
        width: 0;
        background: initial
    }
`



