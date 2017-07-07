import { get } from 'axios';
import React, { Component } from 'react';

import LoadingPage from '../LoadingPage';
import StatisticsTable from '../StatisticsTable';
import UserNotFound from '../UserNotFound';

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      error: '',
      statistics: [],
    };

    this.fetchUserStatistics = this.fetchUserStatistics.bind(this);
  }

  componentDidMount() {
    const permalink = this.props.match.params.permalink;
    this.setState({ isFetching: true, error: '' });
    this.fetchUserStatistics(permalink);
  }

  render() {
    const { isFetching, error, statistics } = this.state;

    if (isFetching) {
      return <LoadingPage />;
    }

    if (error) {
      return <UserNotFound message={error} />;
    }

    const permalink = this.props.match.params.permalink;
    return <StatisticsTable permalink={permalink} statistics={statistics} />;
  }

  async fetchUserStatistics(permalink) {
    try {
      const response = await get(`http://localhost:4000/api/users/${permalink}/statistics`);
      this.setState({ isFetching: false, statistics: response.data.statistics });
    } catch (error) {
      this.setState({ isFetching: false, error: error.response.data.message });
    }
  }
}

export default UserPage;
