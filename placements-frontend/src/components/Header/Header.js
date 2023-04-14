import classes from './Header.module.css'
import logo1 from './logo1.png'
import { Link } from 'react-router-dom'
import { BiSearch } from "react-icons/bi"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../../api";
const Header = () => {
    const [name, setName] = useState('')
    const navigate = useNavigate()
    const search = (e) => {
        e.preventDefault()
        navigate(`/search?q=${name}`)
    }
    return <div className={classes.header}>
        <div style={{ margin: "1rem 0rem", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={logo1} className={classes.logo} />
            <Link to="/" className={classes.link}>Dashboard</Link>
            <Link to="/stats" className={classes.link}>Stats</Link>
            <Link to="/addrecruiter" className={classes.link} >Add Recruiter</Link>
            <Link to="/allrecruiter" className={classes.link}>All Recruiters</Link>

            <form className={classes.search_div} onSubmit={search}>
                <BiSearch className={classes.icon} />
                <input type="text" className={classes.search} placeholder="Search" onChange={(e) => setName(e.target.value)} value={name} />
            </form>
        </div>

    </div>
}

export default Header