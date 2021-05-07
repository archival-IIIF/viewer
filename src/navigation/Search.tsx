import * as React from 'react';
import SearchApi, {AnnotationType, HitType} from "../fetch/SearchApi";
import './search.css';
import Chip from '@material-ui/core/Chip';
import Cache from "../lib/Cache";
import TextField from '@material-ui/core/TextField';
import {ISearchService} from "../interface/IManifestData";
import i18next from 'i18next';
import {useEffect, useState} from "react";

interface IProps {
    searchService: ISearchService;
    q: string | null;
}

export default function Search(props: IProps) {

    const [currentAnnotation, setCurrentAnnotation] = useState<AnnotationType | undefined>(undefined);
    const [searchPhrase, setSearchPhrase] = useState<string>(props.q ?? '');
    const [hits, setHits] = useState<HitType[]>([]);

    const setCurrentAnnotation2 = (currentAnnotation?: AnnotationType) => {
        Cache.ee.emit('annotation-changed', currentAnnotation);
        setCurrentAnnotation(currentAnnotation);
    }

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchSearchResults(searchPhrase);
    }

    const fetchSearchResults = (searchPhrase: string) => {
        if (searchPhrase === '') {
            setHits([]);
            return;
        }

        const searchUrl = props.searchService.id + '?q=' + searchPhrase;
        SearchApi.get(searchUrl, setHits)
    }

    const renderHits = () => {
        if (hits.length === 0) {
            return <></>;
        }

        const output = [];
        for (const hit of hits) {
            let circleClassName = 'aiiif-circle';
            if (currentAnnotation && hit.resource.id === currentAnnotation.id) {
                circleClassName += ' aiiif-circle-active';
            }
            output.push(
                <div className="aiiif-search-result-item" key={hit.i}
                     onClick={() => setCurrentAnnotation2(hit.resource)}>
                    <Chip className={circleClassName} label={hit.i}/>

                    <p>{stripTags(hit.before)} <strong>{hit.match}</strong> {stripTags(hit.after)}</p>
                </div>
            );
        }

        return output;
    }

    useEffect(() => {
        if (props.q) {
            fetchSearchResults(props.q);
        }
    })

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
