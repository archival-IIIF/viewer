import React, {useContext, useState} from 'react';
import SearchApi, {HitType} from "../../fetch/SearchApi";
import './search.css';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import i18next from 'i18next';
import {AppContext} from "../../AppContext";


export default function Search() {

    const {currentManifest, annotation, setAnnotation} = useContext(AppContext);
    const [searchPhrase, setSearchPhrase] = useState<string>('');
    const [hits, setHits] = useState<HitType[]>([]);
    if (!currentManifest || !currentManifest.search) {
        return <></>;
    }
    const searchId = currentManifest.search.id;

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchSearchResults(searchPhrase);
    }

    const fetchSearchResults = (searchPhrase: string) => {
        if (searchPhrase === '') {
            setHits([]);
            return;
        }

        const searchUrl = searchId + '?q=' + searchPhrase;
        SearchApi.get(searchUrl, setHits)
    }

    const renderHits = () => {
        if (hits.length === 0) {
            return <></>;
        }

        const output = [];
        for (const hit of hits) {
            let circleClassName = 'aiiif-circle';
            if (annotation && hit.resource.id === annotation.id) {
                circleClassName += ' aiiif-circle-active';
            }
            output.push(
                <div className="aiiif-search-result-item" key={hit.i}
                     onClick={() => setAnnotation(hit.resource)}>
                    <Chip className={circleClassName} label={hit.i}/>

                    <p>{stripTags(hit.before)} <strong>{hit.match}</strong> {stripTags(hit.after)}</p>
                </div>
            );
        }

        return output;
    }

    /*useEffect(() => {
        if (props.q) {
            fetchSearchResults(props.q);
        }
    })*/

    return <div className="aiiif-search">
        <form onSubmit={onSubmit}>
            <TextField
                className="aiiif-search-input"
                label={i18next.t('common:searchInputLabel')}
                type="search"
                value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value)}
            />
        </form>
        {renderHits()}
    </div>;
}

function stripTags(input: string) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}
