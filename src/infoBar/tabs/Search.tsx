import {useContext, useState, useEffect, useRef, type SubmitEvent, type KeyboardEvent} from 'react';
import './search.css';
import TextField from '@mui/material/TextField';
import i18next from 'i18next';
import {AppContext} from "../../AppContext";
import {CircularProgress} from "@mui/material";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Autocomplete from '@mui/material/Autocomplete';
import {debounce} from 'throttle-debounce';
import fetchAutoCompleteApi, {type IAutoCompleteTerms} from "../../fetch/AutoCompleteApi";
import fetchSearchApi from "../../fetch/SearchApi";

const autocompleteWaitInterval = 300;

export default function Search() {

    const {currentManifest, currentAnnotation, setCurrentAnnotation, searchResult, setSearchResult, q, setQ, setAlert} =
        useContext(AppContext);
    const [searchPhrase, setSearchPhrase] = useState<string>(q);
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState<boolean>(false);
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false);
    const [autocompleteResult, setAutocompleteResult] = useState<IAutoCompleteTerms[]>([]);
    const autocompleteDebounce = useRef(debounce( autocompleteWaitInterval, (value: string) => autocomplete(value)));

    useEffect(() => {

        if (currentManifest?.search) {
            setSearchResult([]);

            if (q === '') {
                return;
            }

            const searchId = currentManifest.search.id;
            const searchUrl = searchId + '?q=' + q;
            fetchSearchApi(searchUrl, currentManifest).then(h => setSearchResult(h)).catch(a => setAlert(a));
        }
    }, [q, currentManifest, setSearchResult, setAlert]);

    if (!currentManifest?.search) {
        return null;
    }

    const onSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        setQ(searchPhrase);
    }


    const renderHits = () => {
        if (searchResult.length === 0) {
            return null;
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
                    <span className="aiiif-search-badge">
                        {i18next.t('common:pageDot')} {hit.resource.page + 1}
                    </span>

                    {stripTags(hit.before)} <strong>{hit.match}</strong> {stripTags(hit.after)}
                </div>
            );
        }
        return output;
    }

    const handleEnter = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        setQ(searchPhrase);
    }

    const autocomplete = (value: string) => {
        if (value.length < 3 || !currentManifest.search || !currentManifest.search.autoCompleteId) {
            return;
        }

        setIsAutocompleteLoading(true);
        fetchAutoCompleteApi(currentManifest.search.autoCompleteId + '?q=' + value).then(terms => {
            setAutocompleteResult(terms);
            setIsAutocompleteLoading(false);
        });

    }

    const handleAutocompleteInput = (value: string) => {
        setSearchPhrase(value);
        if (value !== '') {
            autocompleteDebounce.current(value);
        }
    }

    return <div className="aiiif-search">
        <form onSubmit={onSubmit}>
            <Autocomplete
                open={isAutocompleteOpen}
                value={searchPhrase}
                onOpen={() => setIsAutocompleteOpen(true)}
                onClose={() => setIsAutocompleteOpen(false)}
                options={autocompleteResult.map((option) => option.match)}
                onInputChange={(_event, value) => handleAutocompleteInput(value)}
                loading={isAutocompleteLoading}
                noOptionsText=""
                onChange={(_event, value) => setQ(value ?? '')}
                className="amsab-iiif-autocomplete"
                freeSolo={true}
                selectOnFocus={false}
                autoSelect={false}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={i18next.t('common:searchInputLabel')}
                        onKeyUp={event => handleEnter(event)}
                        slotProps={{input: {
                            ...params.slotProps.input,
                            endAdornment: (
                                <div>
                                    {isAutocompleteLoading ?
                                        <CircularProgress color="inherit" size={20} /> :
                                        <FontAwesomeIcon icon={faSearch} onClick={() => setQ(q)} />
                                    }
                                    {params.slotProps.input.endAdornment}
                                </div>
                            ),
                        }}}
                    />
                )}
            />

        </form>
        {renderHits()}
    </div>;
}

function stripTags(input: string) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}
