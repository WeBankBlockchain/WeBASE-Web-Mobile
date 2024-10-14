import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ClientContextProvider } from './context/ClientContext';


//启用多语言
import './locales/i18n'
import { WCContextProvider } from './context/WCContext';
import { MPContextProvider } from './context/MPContext';
import App from './App';
import Vconsole from 'vconsole'
import { WeConsole } from './context/WeConsole';
import { loadKeyFile } from './elements/KeyFileCache';
import GenAssetsModal from './animate/GenAssetsModal';
import GetAssetsModal from './animate/GetAssetsModal';
import JumpTestApp from './pages/test/JumpTestApp';
import { isHKEnv } from './context/Const';

new Vconsole()
if (!isHKEnv) {
  WeConsole()
  
}

//加载关键资源到缓存
loadKeyFile();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <ClientContextProvider>
    <WCContextProvider>
      <MPContextProvider>
        <App />
        {/* <JumpTestApp /> */}
        {/* <GenAssetsModal /> */}
        {/* <GetAssetsModal imageUrl={process.env.PUBLIC_URL + "/test/test_asset.png"} /> */}
      </MPContextProvider>
    </WCContextProvider>
  </ClientContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
