import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import { User } from './models/user';
import * as UsersApi from "./network/users_api";
import OrdersListPage from './pages/OrderListPage';
import NotFoundPage from './pages/NotFoundPage';
import OrderInputPage from './pages/OrderInputPage';
import styles from "./styles/App.module.css";
import SignUpModal from './components/SignUpModal';

function App() {

	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	useEffect(() => {
		async function refreshToken() {

			const jwtAccessCookie = document.cookie
				.split(";")
				.find((cookie) => cookie.includes("jwt-access"));

			const jwtRefreshCookie = document.cookie
				.split(";")
				.find((cookie) => cookie.includes("jwt-refresh"));
			

			if (!jwtAccessCookie && jwtRefreshCookie) {
				await UsersApi.refresh(jwtRefreshCookie);
			}
		}

		async function fetchLoggedInUser() {
			try {
				const user = await UsersApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		refreshToken();
		fetchLoggedInUser();
	}, []);


	return (
		<BrowserRouter>
			<div>
				<NavBar
					loggedInUser={loggedInUser}
					onLoginClicked={() => setShowLoginModal(true)}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<Container className={styles.pageContainer}>
					<Routes>
						<Route
							path='/input'
							element={<OrderInputPage loggedInUser={loggedInUser} />}
						/>
						<Route
							path='/'
							element={<OrdersListPage loggedInUser={loggedInUser} />}
						/>
						<Route
							path='/*'
							element={<NotFoundPage />}
						/>
					</Routes>
				</Container>
				{showSignUpModal &&
					<SignUpModal
						onDismiss={() => setShowSignUpModal(false)}
						onSignUpSuccessful={(user) => {
							setLoggedInUser(user);
							setShowSignUpModal(false);
						}}
					/>
				}
				{showLoginModal &&
					<LoginModal
						onDismiss={() => setShowLoginModal(false)}
						onLoginSuccessful={(user) => {
							setLoggedInUser(user);
							setShowLoginModal(false);
						}}
					/>
				}
			</div>
		</BrowserRouter>
	);
}

export default App;