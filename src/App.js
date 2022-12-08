import { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CustomersTable from "./components/CustomersTable";
import UpdateCustomer from "./components/UpdateCustomer";
import Spinner from "./components/Spinner";
import Logo from "./assets/clic-logo.png"
import './App.css';
import NotFound from "./components/NotFound";

function App() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")


  useEffect(() => {
    let isUnmounted = false;
    async function getData() {
      try {
        const endpoint = await fetch("http://localhost:5000")
        const data = await endpoint.json()
        if (!isUnmounted) {
          setLoading(true)
          setCustomers(data)
          console.log(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getData()

    return () => { isUnmounted = true; }
  }, [])

  function search(rows = []) {
    console.log(rows)
    if (rows.length === 0) return false
    return rows.filter(row => row.email.toLowerCase().indexOf(query) > -1
      || row.first_name.toLowerCase().indexOf(query) > -1
      || row.state.toLowerCase().indexOf(query) > -1)
  }

  function updatedData(data) {
    const updatedData = customers.map(c => c.id !== data.id ? c : data);
    console.log(updatedData)
    setCustomers(updatedData)
    // console.log("liftinf exitoso", customers)
  }

  return (
    <div className="container">
      {loading ?
        <>
          <Router>
            <nav >
              <ul className="navbarLinksUL">
                <li ><Link to="/" >
                  <img src={Logo} className="logoImg" alt="Clic Readers" />
                </Link></li>
                <div className="listItems">
                  <li ><Link to="/" className="navbarLinksLI">Home</Link></li>
                  <li ><Link to="/update" className="navbarLinksLI">Update</Link></li>
                </div>
              </ul>
            </nav>


            <Switch>
              <Route path="/" exact>
                <div className="cta_buttons_container my-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search by customer name, email or account status" aria-label="Search by customer name, email or account status" aria-describedby="basic-addon2" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                  <span><span className="customersLength">{customers.length}</span> register customers</span>
                </div>
                <CustomersTable
                  customers={search(customers)}
                />
              </Route>
              <Route path="/update">
                <div className="cta_buttons_container my-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search by customer name, email or account status" aria-label="Search by customer name, email or account status" aria-describedby="basic-addon2" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                  <span><span className="customersLength">{customers.length}</span> register customers</span>
                </div>
                <UpdateCustomer
                  customers={search(customers)}
                  updatedData={updatedData} />
              </Route>

              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </Router>



        </>
        :
        <Spinner />}
    </div>
  );
}

export default App;
