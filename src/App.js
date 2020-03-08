import React from 'react';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'
import AuthStatusView from './AuthStatusView';
import Todos from './Todos';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "https://hasura-app-with-netlify.herokuapp.com/v1/graphql",

  request: (operation) => {
    const credentials = localStorage.getItem('gotrue.user')
    const user = credentials && JSON.parse(credentials);
    const token = user?.token?.access_token;
    console.log("token", token)
    
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
});

function App() {
  const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL // should look something like "https://foo.netlify.com"
  if (!url)
    throw new Error(
      'process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables',
    )

  return (
    <IdentityContextProvider url={url}>
      <ApolloProvider client={client}>
        <div className="App">
          <Todos />
          <AuthStatusView />
        </div>
      </ApolloProvider>
    </IdentityContextProvider>
  );
}

export default App;
