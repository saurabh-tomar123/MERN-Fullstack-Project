import './App.css';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Signup from './signup';
import TodoListTable from './TodoList';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={ <Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/todo' element={ <ProtectedRoute > <TodoListTable /> </ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
