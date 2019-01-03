class Metadata {

    get(data, key) {
        if (!data.hasOwnProperty('metadata')) {
            return null;
        }
        const metadata = data.metadata;

        for (const i in metadata) {
            if (metadata.hasOwnProperty(i)) {
                if (metadata[i].hasOwnProperty('label') &&
                    metadata[i].hasOwnProperty('value') &&
                    metadata[i].label === 'fileType') {
                    return metadata[i].value;
                }
            }
        }

        return null;
    }

}

export default Metadata;
