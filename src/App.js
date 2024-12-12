import './App.css';
import MainPage from "./Pages/MainPage";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import IndexData from "./Pages/IndexData";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/details/:index" element={<IndexData/>}/>
            </Routes>
        </Router>
    );
}

export default App;
