import React from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import md5 from 'md5';

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    isFormValid = () => {
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all the fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        }
        else if(!this.isPasswordValid(this.state)) 
        {
            error = { message: 'Password is invalid' };
            this.setState({ errors: errors.concat(error) });
            return false;    
        }
        else 
        {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    isPasswordValid = ({password, passwordConfirmation}) => {
        return password === passwordConfirmation && password.length >= 6;
    }

    isFormEmpty = ({username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    };
    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }
    handleSubmit = (e) => {
        if(this.isFormValid()) 
        {
            e.preventDefault();
            this.setState({ errors: [], loading: true});
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('User saved');
                            this.setState({loading: false});
                        })                   
                    }) 
                    .catch(err => {
                        console.error(`Error during registration: ${err}`);
                        this.setState({errors: this.state.errors.concat(err), loading: false});
                    })
                })
                .catch(err => {
                    console.error(`Error during registration: ${err}`);
                    this.setState({errors: this.state.errors.concat(err), loading: false});
                })
        }
        else {

        }
    }
    render() {
        const {username, email, password, passwordConfirmation, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign ="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="teal" textAlign="center">
                        <Icon name="puzzle piece" color="teal"/>
                        Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input 
                                fluid name="username" 
                                icon="user" 
                                iconPosition="left"
                                placeholder="Username" 
                                value={username}
                                onChange={this.handleChange} 
                                className={errors.some(error => error.message.toLowerCase().includes('username')) ? 'error' : ''}
                                type="text"
                            />

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

                            <Form.Input 
                                fluid name="passwordConfirmation" 
                                icon="repeat" iconPosition="left"
                                placeholder="Password Confirmation" 
                                value={passwordConfirmation}
                                onChange={this.handleChange} 
                                className={errors.some(error => error.message.toLowerCase().includes('passwordConfirmation')) ? 'error' : ''}
                                type="password"
                            />

                            <Button 
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                color="teal" 
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
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;