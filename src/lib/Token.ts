type tokenValue = {
    accessToken: string;
    expiresIn: number;
    messageId: number
}

type token = {
    value: tokenValue;
    expiresAt: number;
}

class Token {

    static get() {
        const rawToken = sessionStorage.getItem('aiiif-token');
        if (!rawToken) {
            return '';
        }
        const token: token = JSON.parse(rawToken);

        if (!token.value || !token.value.accessToken || !token.expiresAt) {
             return '';
        }

        if (token.expiresAt < Date.now() / 1000) {
            sessionStorage.removeItem('aiiif-token');
            return '';
        }

        return token.value.accessToken;
    };

    static set(data: tokenValue) {

        sessionStorage.setItem('aiiif-token', JSON.stringify({
            value: data,
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
