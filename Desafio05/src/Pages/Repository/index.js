import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';

import api from '../../services/api';

import {
  Loading,
  Owner,
  IssueList,
  SelectOptions,
  PageActions,
} from './styles';
import Container from '../../components/Container';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    loading: true,
    repository: {},
    issues: [],
    state: 'open',
    page: 1,
    limit: 10,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repo, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      issues: issues.data,
      repository: repo.data,
      loading: false,
    });
  }

  handleIssueFilter = async () => {
    const { match } = this.props;
    const { page, state, limit } = this.state;

    console.log(state);
    console.log(limit);

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state,
        per_page: limit,
        page,
        limit,
      },
    });

    this.setState({
      state,
      limit,
      issues: [...issues.data],
    });
  };

  handlePage = async action => {
    const { page, state } = this.state;
    await this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });
    this.handleIssueFilter(state);
  };

  render() {
    const { loading, repository, issues, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    const options = [
      { value: 'open', label: 'Open' },
      { value: 'closed', label: 'Closed' },
      { value: 'all', label: 'All' },
    ];

    const limitOptions = [
      { value: '10', label: '10' },
      { value: '20', label: '20' },
      { value: '30', label: '30' },
    ];

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <SelectOptions>
          <Select
            className="select"
            placeholder="Issue state"
            onChange={e => this.setState({ state: e.value })}
            options={options}
          />

          <Select
            className="select"
            placeholder="Limit"
            onChange={e => this.setState({ limit: e.value })}
            options={limitOptions}
          />

          <button onClick={this.handleIssueFilter}>Filtrar</button>
        </SelectOptions>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PageActions>
          <button
            type="button"
            disabled={page < 2}
            onClick={() => this.handlePage('back')}
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button type="button" onClick={() => this.handlePage('next')}>
            Próximo
          </button>
        </PageActions>
      </Container>
    );
  }
}
