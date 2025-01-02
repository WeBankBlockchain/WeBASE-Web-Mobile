import { useTranslation } from "react-i18next";
import { printLog } from "../context/LogTools";
import { ShowToast } from "../tools/CommonUtils";

interface CopyProps {
    //复制控件可能的参数
    style?: React.CSSProperties;
    copyStr: string;
}
const Copy: React.FC<CopyProps> = ({ style, copyStr }) => {

    const { t } = useTranslation();

    return <img src={process.env.PUBLIC_URL + '/icons/copy.svg'} style={style} onClick={async () => {
        try {
            await navigator.clipboard.writeText(copyStr);
            ShowToast(t("copyed"))
        } catch (err) {
            ShowToast(t("copy_error"))
            printLog(["cppy failed", err])
        }
    }} />
}

export default Copy;