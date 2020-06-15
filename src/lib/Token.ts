import UrlValidation from "./UrlValidation";

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


    static get(url: string) {
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

        return token.value.accessToken;
    };


    static set(data: tokenValue, tokenUrl: string) {
        if (UrlValidation.isURL(tokenUrl)) {
            sessionStorage.setItem(tokenUrl, JSON.stringify({
                value: data,
                expiresAt: Date.now() / 1000 + data.expiresIn
            }));
        }
    };

    static has(url: string) {
        return this.get(url);
    }

    static delete(tokenId: string) {
        sessionStorage.removeItem(tokenId);
    }
}

export default Token;
