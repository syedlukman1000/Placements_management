import ReactQuill from "react-quill";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import classes from "./addrecruiter.module.css";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import api from "../../api"

function Addrecruiter() {
    const [value, setValue] = useState();
    const nameref = React.useRef()
    const locationref = React.useRef()
    const typeref = React.useRef()
    const imageurlref = React.useRef()

    const [inserting, setInserting] = useState(false)
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const addrecruiter = async (e) => {
        e.preventDefault()
        setInserting(true)
        try {
            const companyname = nameref.current.value
            const location = locationref.current.value
            const description = value
            const imageurl = imageurlref.current.value
            const type = typeref.current.checked
            let companytype = ''
            if (type) {
                companytype = 'product'
            }
            else {
                companytype = 'service'

            }
            const res = await api.post('/addrecruiter', {
                name: companyname,
                location,
                description,
                type: companytype,
                imageurl
            })
            if (res.data.success) {
                setSuccess("Recruiter added successfull.")
                console.log("successs")
            }
            setInserting(false)
        } catch (err) {
            setInserting(false)
            setError(err.message)
            console.log(err)
        }
    }
    return (
        <div className={classes.thisbody}>
            <h1 style={{ fontSize: "24px" }}>Add Recruiter</h1>
            <div className={classes.mainbody}>
                <form className={classes.form} onSubmit={addrecruiter}>
                    <div className={classes.control}>
                        <input
                            className={classes.input}
                            name="companyname"
                            type="text"
                            placeholder=" "
                            required
                            ref={nameref}
                        />
                        <span>Name</span>
                    </div>
                    <div className={classes.control}>
                        <input
                            className={classes.input}
                            name="companylocation"
                            type="text"
                            placeholder=" "
                            required
                            ref={locationref}
                        />
                        <span>Location</span>
                    </div>
                    <div className={classes.control}>
                        {/*<p style={{ fontSize: "0.85rem", color: "#909090" }}>Description</p>
                             <ReactQuill
                                theme="snow"
                                onChange={(e) => setValue(e)}
                                value={value}
                            /> */}
                        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} className={classes.input} required />
                        <span>Description</span>
                    </div>

                    <div className={classes.control}>
                        <input
                            className={classes.input}
                            type="text"
                            placeholder=" "
                            required
                            ref={imageurlref}
                        />
                        <span>Image url</span>
                    </div>
                    <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                        <label style={{ fontSize: "0.85rem", color: "#202124" }}>Company type</label>
                        <div className={`${classes.type}`}>
                            <input type="radio" name="type" value="service" ref={typeref} />
                            <span style={{ fontSize: "0.85rem", color: "#909090" }}>Service</span>
                            <input type="radio" name="type" value="product" style={{ marginLeft: "1.5rem" }} ref={typeref} />
                            <span style={{ fontSize: "0.85rem", color: "#909090" }}>Product</span>
                        </div>
                    </div>
                    <button className={classes.button}>
                        {inserting ?
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <Spinner size={12} />
                            </div>
                            :
                            "Add"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Addrecruiter;
