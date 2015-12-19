'use strict';

var React = require('react-native');
var buffer = require('buffer');

var {
    Text,
    View,
    Component,
    ListView
    } = React;

class Feed extends Component {
    constructor (props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(['A', 'B', 'C'])
        };
    }

    componentDidMount () {
        this.fetchFeed();
    }

    fetchFeed () {
        console.log('Im in here');
        require('./AuthService').getAuthInfo((err, authInfo)=> {
            var url = 'https://api.github.com/users/'
                + authInfo.user.login
                + '/received_events';

            fetch(url, {
                headers: authInfo.header
            })
            .then((response)=> response.json())
            .then((responseData)=> {
                var feedItems =
                    responseData.filter((ev)=>
                        ev.type == 'PushEvent');

                console.log(feedItems);
                this.setState({
                   dataSource: this.state.dataSource
                        .cloneWithRows(feedItems)
                });
            })
            .catch((err)=> {console.log(err);})
        });
    }

    renderRow (rowData) {
        return (
            <Text style={{
                color: '#333',
                backgroundColor: '#fff',
                alignSelf: 'center'
            }}>
                {rowData}
            </Text>
        );
    }

    render () {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start'
            }}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)} />
            </View>
        );
    }
}

module.exports = Feed;