import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages:[],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        numUniqueUsers: '',
        serachTerm: '',
        searchLoading: false
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if(channel && user) {
            this.addListeners(channel.id);
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            console.log(loadedMessages);
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
        });
    }

    handleSearchChange = e => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm)
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, [])
        const numUniqueUsers = `${uniqueUsers.length} user(s)`;
        this.setState({ numUniqueUsers });
    }

    displayChannelName = channel => channel ? `#${channel.name}` : '';

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    );
    render() {
        const { messagesRef, messages, channel, user, numUniqueUsers } = this.state;
        return(
            <React.Fragment>
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)}  
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}         
                />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user}/>
            </React.Fragment>
        );
    }
}

export default Messages;