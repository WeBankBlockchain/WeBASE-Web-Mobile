//这是基本的页面布局

//1、页面整体布局，纵向布局，宽度占满屏幕
export const MainPageFullScreenStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', height: '100vh' }
//2、内容部分占据中间
export const ContentPageStyle: React.CSSProperties = { flex: 1, overflow: 'auto', width: '100%' };
//3、头部和尾部分别在界面最顶部和最底部
export const UpDownStyle: React.CSSProperties = { height: 'auto', width: '100%' }

//基本控件布局

//1、纵向布局，居中
export const ColumnCenterStyle: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }
//2、居中（纵横双向）
export const CenterStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center" }
//3、横向，边分
export const LRSideStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" }
//4、横向，左到右，垂直居中
export const L2RStyle: React.CSSProperties = { display: "flex", justifyContent: "flex-start", alignItems: "center" }
//5、横向，右到左，垂直居中
export const R2LStyle: React.CSSProperties = { display: "flex", justifyContent: "flex-end", alignItems: "center" }
//6、纵向布局，从上到下
export const ColumnStyle: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center" }

//对话框基本样式
export const BaseModalStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, background: '#000000b3' }

//基本文字样式
export const BaseTitleStyle: React.CSSProperties = { fontWeight: 550, fontSize: '15px' }
export const ListTitletyle: React.CSSProperties = { fontWeight: 550, fontSize: '13px' }