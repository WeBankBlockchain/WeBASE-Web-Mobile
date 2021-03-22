import Clipboard from 'clipboard'
import { Toast } from 'vant';
function clipboardSuccess() {
    Toast.success('复制成功');
}

function clipboardError() {
    Toast.fail('复制失败，请手动选择复制');
}

export default function handleClipboard(text, event) {
    const clipboard = new Clipboard(event.target, {
        text: () => text
    })
    clipboard.on('success', () => {
        clipboardSuccess()
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        clipboardError()
        clipboard.destroy()
    })
    clipboard.onClick(event)
}
