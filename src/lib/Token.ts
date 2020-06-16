import UrlValidation from "./UrlValidation";
import Cache from "./Cache";
import Manifest from "./Manifest";
import InfoJson from "./InfoJson";

type tokenValue = {
    accessToken: string;
    expiresIn: number;
    messageId: number
}

type token = {
    value: tokenValue;
    logoutUrl?: string;
    expiresAt: number;
}

class Token {

    static activeTokens: string[] = [];

    static get(url: string) {
        const token = this.getBase(url);
        if (!token) {
            return undefined;
        }

        if (!this.activeTokens.includes(url)) {
            this.activeTokens.push(url);
            if (this.activeTokens.length === 1) {
                Cache.ee.emit('token-in-use');
            }
        }

        return token.value.accessToken;
    };

    static getLogoutUrl(url: string) {
       const token = this.getBase(url);
       if (!token) {
           return undefined;
       }

        return token.logoutUrl;
    };

    static getBase(url: string) {
        const rawToken = sessionStorage.getItem(url);
        if (!rawToken) {
            return undefined;
        }
        const token: token = JSON.parse(rawToken);

        if (!token.value || !token.value.accessToken || !token.expiresAt) {
            return undefined;
        }

        if (token.expiresAt < Date.now() / 1000) {
            sessionStorage.removeItem(url);
            return undefined;
        }

        return token;
    };

    static hasActiveToken():boolean {
        return this.activeTokens.length > 0
    }

    static set(data: tokenValue, tokenUrl: string, logoutUrl?: string) {

        if (!this.activeTokens.includes(tokenUrl)) {
            this.activeTokens.push(tokenUrl);
            if (this.activeTokens.length === 1) {
                Cache.ee.emit('token-in-use');
            }
        }

        if (UrlValidation.isURL(tokenUrl)) {
            sessionStorage.setItem(tokenUrl, JSON.stringify({
                value: data,
                expiresAt: Date.now() / 1000 + data.expiresIn,
                logoutUrl
            }));
        }
    };

    static has(url: string) {
        return this.get(url);
    }

    static delete(tokenId: string) {
        sessionStorage.removeItem(tokenId);
    }

    static deleteActiveTokens() {

        console.log(this.activeTokens);

        for (const tokenId of this.activeTokens) {
            sessionStorage.removeItem(tokenId);
            const logoutUrl = this.getLogoutUrl(tokenId);
            if (logoutUrl){
                window.open(logoutUrl, '_blank');
            }
        }
        this.activeTokens = [];
        Manifest.clearCache();
        InfoJson.clearCache();
        Cache.ee.emit('token-in-use');
    }
}

export default Token;
