import React, { useRef, useEffect } from 'react'

function useLongPress(callback: () => void, delay = 1000) {

    const longPressActivated  = useRef(false)
    const timer = useRef<any>(null)

    const start = ( ) => {
        console.log('-->>long press start 开始', longPressActivated.current);

        longPressActivated.current = true
        
        timer.current = window.setTimeout(() => {
            console.log('-->>long press 时间到', longPressActivated.current);
            
            if(longPressActivated){
                console.log('<<--long press end 满足时间 ', longPressActivated.current);
                
                callback();
            }
  
            longPressActivated.current = false
        }, delay);
    };

    const clear = () => {
        console.log('-->> long press 退出', longPressActivated.current);
        longPressActivated.current = false
        clearTimeout(timer.current)
        timer.current = null
    };

    return { onMouseDown: start, onMouseUp: clear, onMouseLeave: clear, onTouchStart: start, onTouchEnd: clear };
}


export default useLongPress