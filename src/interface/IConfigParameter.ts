interface IConfigParameter {
    id: string;
    language?: string;
    manifest?: string;
    disableSharing?: boolean;
    lazyTree?: boolean;
    disableDownload?: boolean;
    disableLanguageSelection?: boolean;
    externalSearchUrl?: string;
    allowedOrigins?: string | string[];
}

export default IConfigParameter;

