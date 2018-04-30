class Metadata {


    get(data, key) {
        if (!data.hasOwnProperty("metadata")) {
            return null;
        }
        let metadata = data.metadata;

        for (let i in metadata) {
            if (metadata[i].hasOwnProperty("label") && metadata[i].hasOwnProperty("value") && metadata[i].label === "fileType") {
                return metadata[i].value;
            }
        }

        return null;

    }

}

export default Metadata;