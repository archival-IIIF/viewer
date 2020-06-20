interface IConfigParameter {
    id: string;
    language?: string;
    manifest?: string;
    disableSharing?: boolean;
    allowedOrigins?: string | string[];
}

export default IConfigParameter;

