interface IConfigParameter {
    id: string;
    language?: string;
    manifest?: string;
    disableSharing?: boolean;
    disableLanguageSelection?: boolean;
    externalSearchUrl?: string;
    allowedOrigins?: string | string[];
}

export default IConfigParameter;

