import React, {useContext, useState} from 'react';
import SearchApi from "../../fetch/SearchApi";
import './search.css';
import TextField from '@material-ui/core/TextField';
import i18next from 'i18next';
import {AppContext} from "../../AppContext";


export default function Search() {

    const {currentManifest, currentAnnotation, setCurrentAnnotation, searchResult,
        setSearchResult} = useContext(AppContext);
    const [searchPhrase, setSearchPhrase] = useState<string>('');
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
            setSearchResult([]);
            return;
        }

        const searchUrl = searchId + '?q=' + searchPhrase;
        SearchApi.get(searchUrl, currentManifest, setSearchResult)
    }

    const renderHits = () => {
        if (searchResult.length === 0) {
            return <></>;
        }

        const output = [];
        for (const hit of searchResult) {
            let className = 'aiiif-search-result-item';
            if (currentAnnotation && hit.resource.id === currentAnnotation.id) {
                className += ' aiiif-search-result-item-active';
            }

            output.push(
                <div className={className} key={hit.i}
                     onClick={() => setCurrentAnnotation(hit.resource)}>
                    <span className="aiiif-search-badge">{i18next.t('common:pageDot')} {hit.resource.page + 1}</span>

                    {stripTags(hit.before)} <strong>{hit.match}</strong> {stripTags(hit.after)}
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
