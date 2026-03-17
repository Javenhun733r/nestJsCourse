import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function App() {
	const clientId = process.env.REACT_APP_CLIENT_ID;
	return (
		<GoogleOAuthProvider clientId={clientId}>
			<GoogleLogin
				buttonText='Login'
				onSuccess={response => {
					console.log(response);
					fetch('http://localhost:3000/auth/google-authentication', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							token: response.credential,
						}),
					})
						.then(response => console.log(response))
						.then(data => console.log(data));
				}}
			/>
		</GoogleOAuthProvider>
	);
}

export default App;
