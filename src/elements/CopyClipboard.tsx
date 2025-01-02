import { useTranslation } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ShowToast } from "../tools/CommonUtils";

interface CopyProps {
    //复制控件可能的参数
    style?: React.CSSProperties;
    copyStr: string;
}
const CopyClipboard: React.FC<CopyProps> = ({ style, copyStr }) => {

    const { t } = useTranslation();

    return <CopyToClipboard text={copyStr} onCopy={() => ShowToast(t("copyed"))}>
        <img style={style} src={process.env.PUBLIC_URL + '/icons/copy.svg'} />
    </CopyToClipboard>
}

export default CopyClipboard;