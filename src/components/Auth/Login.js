import React from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';


class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    isFormValid = ({email, password}) => {
        return password && email;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    };
    
    handleSubmit = (e) => {
        if(this.isFormValid(this.state)) 
        {
            e.preventDefault();
            this.setState({ errors: [], loading: true});
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    this.setState({loading: false});
                })
                .catch(err => {
                    console.error(`Error during sign-in: ${err}`);
                    this.setState({errors: this.state.errors.concat(err), loading: false});
                });
        }
    };
    render() {
        const {email, password, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign ="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet"/>
                        Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input 
                                fluid name="email" 
                                icon="mail" 
                                iconPosition="left"
                                placeholder="E-mail Address" 
                                onChange={this.handleChange} 
                                value={email}
                                className={errors.some(error => error.message.toLowerCase().includes('email')) ? 'error' : ''}
                                type="text"
                            />
                            <Form.Input 
                                fluid name="password" 
                                icon="lock" 
                                iconPosition="left"
                                placeholder="Password" 
                                onChange={this.handleChange} 
                                value={password}
                                className={errors.some(error => error.message.toLowerCase().includes('password')) ? 'error' : ''}
                                type="password"
                            />
                            <Button 
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                color="violet" 
                                fluid size="large"
                            >
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Not registered yet? <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;