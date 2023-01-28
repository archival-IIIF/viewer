import 'core-js';
import 'react-app-polyfill/ie11';
import Init from './Init';
import ManifestData from './entity/ManifestData';
import ManifestDataThumbnail from './entity/ManifestDataThumbnail';
import AutoCompleteApi from './fetch/AutoCompleteApi';
import ImageApi from './fetch/ImageApi';
import PresentationApi from './fetch/PresentationApi';
import SearchApi from './fetch/SearchApi';
import FolderView from './folder/FolderView';
import Item from './folder/Item';
import IIIFIcon from './icons/IIIFIcon';
import Download from './infoBar/tabs/Download';
import Metadata from './infoBar/tabs/Metadata';
import Pages from './infoBar/tabs/Pages';
import Search from './infoBar/tabs/Search';
import Share from './infoBar/tabs/Share';
import InfoBar from './infoBar/InfoBar';
import TabButton from './infoBar/TabButton';
import TabButtons from './infoBar/TabButtons';
import Tabs from './infoBar/Tabs';
import * as IConfigParameter from './interface/IConfigParameter';
import * as IManifestData from './interface/IManifestData';
import * as IManifestDataThumbnail from './interface/IManifestDataThumbnail';
import * as ISequence from './interface/ISequence';
import * as ITranscription from './interface/ITranscription';
import Content1 from './layout/Content1';
import Content2 from './layout/Content2';
import Content3 from './layout/Content3';
import Main from './layout/Main';
import Cache from './lib/Cache';
import Config from './lib/Config';
import Diacritics from './lib/Diacritics';
import InitI18n from './lib/InitI18n';
import * as ManifestHelpers from './lib/ManifestHelpers';
import ManifestHistory from './lib/ManifestHistory';
import Token from './lib/Token';
import TouchDetection from './lib/TouchDetection';
import UrlValidation from './lib/UrlValidation';
import WindowInfo from './lib/WindowInfo';
import Splitter from './splitter/Splitter';
import FullscreenButton from './topBar/FullscreenButton';
import ExternalSearch from './topBar/ExternalSearch';
import LanguageSwitcher from './topBar/LanguageSwitcher';
import TopBar from './topBar/TopBar';
import TreeBuilder from './treeView/TreeBuilder';
import TreeView from './treeView/TreeView';
import TreeViewItem from './treeView/TreeViewItem';
import ImageButtons from './viewer/image/ImageButtons';
import ReactOpenSeadragon from './viewer/image/ReactOpenSeadragon';
import MediaPlayer from './viewer/media/MediaPlayer';
import Transcription from './viewer/media/Transcription';
import PdfViewer from './viewer/pdf/PdfViewer';
import Nl2br from './viewer/plainText/Nl2br';
import PlainTextViewer from './viewer/plainText/PlainTextViewer';
import Viewer from './viewer/Viewer';
import ViewerSpinner from './viewer/ViewerSpinner';
import Alert from './Alert';
import App from './App';
import AppContext from './AppContext';
import Login from './Login';

export default Init;

export {
    ManifestData,
    ManifestDataThumbnail,
    AutoCompleteApi,
    ImageApi,
    PresentationApi,
    SearchApi,
    FolderView,
    Item,
    IIIFIcon,
    Download,
    Metadata,
    Pages,
    Search,
    Share,
    InfoBar,
    TabButton,
    TabButtons,
    Tabs,
    IConfigParameter,
    IManifestData,
    IManifestDataThumbnail,
    ISequence,
    ITranscription,
    Content1,
    Content2,
    Content3,
    Main,
    Cache,
    Config,
    Diacritics,
    InitI18n,
    ManifestHelpers,
    ManifestHistory,
    Token,
    TouchDetection,
    UrlValidation,
    WindowInfo,
    Splitter,
    FullscreenButton,
    ExternalSearch,
    LanguageSwitcher,
    TopBar,
    TreeBuilder,
    TreeView,
    TreeViewItem,
    ImageButtons,
    ReactOpenSeadragon,
    MediaPlayer,
    Transcription,
    PdfViewer,
    Nl2br,
    PlainTextViewer,
    Viewer,
    ViewerSpinner,
    Alert,
    App,
    AppContext,
    Init,
    Login
}
