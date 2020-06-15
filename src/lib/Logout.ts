import Token from "./Token";
import Manifest from "./Manifest";

export default function logout(tokenId: string, logoutId: string) {
    Token.delete(tokenId);
    window.open(logoutId, '_blank');
    const id = Manifest.getIdFromCurrentUrl();
    const currentUrl = window.location.href;
    const viewerUrl = currentUrl.substring(0, currentUrl.indexOf('?manifest='));
    window.location.href = viewerUrl + '?manifest=' + id;
}
