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

    static get() {
        const token = this.getFromSession();

        if (token) {
            return token.value.accessToken;
        }

        return '';
    };

    static getFromSession(): token | undefined {
        const rawToken = sessionStorage.getItem('aiiif-token');
        if (!rawToken) {
            return undefined;
        }
        const token: token = JSON.parse(rawToken);

        if (!token.value || !token.value.accessToken || !token.expiresAt) {
            return undefined;
        }

        if (token.expiresAt < Date.now() / 1000) {
            sessionStorage.removeItem('aiiif-token');
            return undefined;
        }

        return token;
    }

    static getLogOutUrl(): string {
        const token = this.getFromSession();

        if (token && token.logoutUrl) {
            return token.logoutUrl;
        }

        return '';
    };

    static set(data: tokenValue, logoutUrl?: string) {

        sessionStorage.setItem('aiiif-token', JSON.stringify({
            value: data,
            logoutUrl,
            expiresAt: Date.now() / 1000 + data.expiresIn
        }));
    };

    static has() {
        return this.get() !== '';
    }

    static delete() {
        sessionStorage.removeItem('aiiif-token');
    }
}

export default Token;
