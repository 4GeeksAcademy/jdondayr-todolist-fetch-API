import React from "react";

// Components imports
import Todolist from "./Todolist.jsx";

const App = () => {
	return (
		<div className="main-container">
			<h1>to-dos</h1>
			<Todolist />
		</div>
	);
};

export default App;