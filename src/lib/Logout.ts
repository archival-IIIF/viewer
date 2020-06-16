import Token from "./Token";
import Manifest from "./Manifest";

export default function logout() {
    Token.deleteActiveTokens();
    const id = Manifest.getIdFromCurrentUrl();
    const currentUrl = window.location.href;
    const viewerUrl = currentUrl.substring(0, currentUrl.indexOf('?manifest='));
    window.location.href = viewerUrl + '?manifest=' + id;
}
