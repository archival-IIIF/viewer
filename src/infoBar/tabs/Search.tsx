import React, {useContext, useState, useEffect} from 'react';
import SearchApi from "../../fetch/SearchApi";
import './search.css';
import TextField from '@material-ui/core/TextField';
import i18next from 'i18next';
import {AppContext} from "../../AppContext";


export default function Search() {

    const {currentManifest, currentAnnotation, setCurrentAnnotation, searchResult,
        setSearchResult, q, setQ} = useContext(AppContext);
    const [searchPhrase, setSearchPhrase] = useState<string>(q);

    useEffect(() => {
        if (currentManifest && currentManifest.search) {
            if (q === '') {
                setSearchResult([]);
                return;
            }

            const searchId = currentManifest.search.id;
            const searchUrl = searchId + '?q=' + q;
            SearchApi.get(searchUrl, currentManifest, setSearchResult);
        }
    }, [q, currentManifest, setSearchResult]);

    if (!currentManifest || !currentManifest.search) {
        return <></>;
    }

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setQ(searchPhrase);
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
