import Router from "./Router";
import "./App.css";
import { UserProvider } from "./UserContext";

function App() {
	return (
		<UserProvider>
			<div className="App">
				<header className="App-header">
					<Router />
				</header>
			</div>
		</UserProvider>
	);
}

export default App;
