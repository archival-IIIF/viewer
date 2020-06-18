import * as React from 'react';
import SearchApi, {AnnotationType, HitType} from "../fetch/SearchApi";
import './search.css';
import Chip from '@material-ui/core/Chip';
import Cache from "../lib/Cache";
import TextField from '@material-ui/core/TextField';
import {ISearchService} from "../interface/IManifestData";
import i18next from 'i18next';

interface IProps {
    searchService: ISearchService;
    q: string | null;
}

interface IState {
    currentAnnotation?: AnnotationType;
    searchPhrase: string;
    hits: HitType[];
}

class Search extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {searchPhrase: '', hits: []};

        this.setSearchPhrase = this.setSearchPhrase.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setHits = this.setHits.bind(this);
    }

    render() {


        return <div className="aiiif-search">
            <form onSubmit={this.onSubmit}>
                <TextField className="aiiif-search-input" label={i18next.t('common:searchInputLabel')} type="search"
                           value={this.state.searchPhrase} onChange={this.setSearchPhrase} />
            </form>
            {this.renderHits()}
        </div>;
    }

    renderHits() {
        if (this.state.hits.length === 0) {
            return [];
        }

        const output = [];
        for (const hit of this.state.hits) {
            let circleClassName = 'aiiif-circle';
            if (this.state.currentAnnotation && hit.resource.id === this.state.currentAnnotation.id) {
                circleClassName += ' aiiif-circle-active';
            }
            output.push(
                <div className="aiiif-search-result-item" key={hit.i}
                     onClick={() => this.setCurrentAnnotation(hit.resource)}>
                    <Chip className={circleClassName} label={hit.i} />

                    <p>{this.stripTags(hit.before)} <strong>{hit.match}</strong> {this.stripTags(hit.after)}</p>
                </div>
            );
        }

        return output;
    }

    setCurrentAnnotation(currentAnnotation?: AnnotationType) {
        Cache.ee.emit('annotation-changed', currentAnnotation);
        this.setState({currentAnnotation})
    }

    setSearchPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchPhrase: event.target.value});
    }

    onSubmit(event: React.FormEvent) {

        event.preventDefault();

        this.fetchSearchResults(this.state.searchPhrase);
    }

    fetchSearchResults(searchPhrase: string) {
        if (searchPhrase === '') {
            this.setState({hits: []});
            return;
        }

        const searchUrl = this.props.searchService.id + '?q=' + searchPhrase;
        SearchApi.get(searchUrl, this.setHits)
    }

    setHits(hits: HitType[]) {
        this.setState({hits});
    }

    stripTags(input: string) {
        return input.replace(/<\/?[^>]+(>|$)/g, "");
    }

    componentDidMount() {
        if (this.props.q) {
            this.setState({searchPhrase: this.props.q});
            this.fetchSearchResults(this.props.q);
        }
    }
}

export default Search;
