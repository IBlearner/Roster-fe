import './App.css';
import React, { useState, useEffect } from 'react';
import Home from "./components/Home"
import SingleShifts from './components/SingleShifts';
import { Grid, Container } from 'semantic-ui-react'

function App() {
    const [users, setUsers] = useState([])
    const [singleUserShifts, setSingleUserShifts] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    const [currentPage, setCurrentPage] = useState("home")
    

    const pageChanger = () => {
        switch (currentPage) {
            case "home":
                return(<Home GoToSingleShifts={GoToSingleShifts}/>)
            case "singleShifts":
                return(<SingleShifts GetSingleShifts={GetSingleShifts} GoToHome={GoToHome} selectedUser={selectedUser}/>)
            default:
                break;
        }
    }
    useEffect(() => {
        console.log('mounted');
        console.log(selectedUser)
        return () => console.log('unmounting...');
    }, [selectedUser]) 
    
    const GoToSingleShifts = (x) => {
        setSelectedUser(x)
        setCurrentPage("singleShifts")
    }

    const GoToHome = x => {
        setCurrentPage("home")
    }

    // const GetAllUsers = () => {
    //     //var users = JSON.stringify(x)
    //     fetch(`http://localhost:3333/users`, {method: "GET"})
    //     .then(result => {return result.json()})
    //     .then(
    //         (result) => {
    //             console.log("I have been called!")
    //             setUsers(result)
    //             console.log(users)
    //         },
    //         (error) => {
    //             console.log(error)
    //         }
    //     )
    //     .catch(err => {console.log(err)})
    // }

    // const GetSingleShifts = (x) => {
    //     var user = JSON.stringify(x)
    //     fetch(`http://localhost:3333/shifts/${user}`, {method: "GET"})
    //     .then(result => {return result.json()})
    //     .then(
    //         (result) => {
    //             setSingleUserShifts(result)
    //             console.log(singleUserShifts)
    //             GoToSingleShifts()
    //         },
    //         (error) => {
    //             console.log(error)
    //         }
    //     )
    //     .catch(err => {console.log(err)})
    // }

    const GetSingleShifts = async (x) => {
        var user = JSON.stringify(x)
        const response = await fetch(`http://localhost:3333/shifts/${user}`, {method: "GET"})
        if (!response.ok) {
            const errorMessage = `An error has occured: ${response.status}: ${response.statusText}`
            console.log(errorMessage)
            throw new Error(errorMessage)
        }
        const userShifts = await response.json()
        console.log(userShifts.data)
        return userShifts.data
        // setSingleUserShifts(userShifts)
        // console.log(singleUserShifts)
        // GoToSingleShifts()
        // .then(result => {return result.json()})
        // .then(
        //     (result) => {
        //         setSingleUserShifts(result)
        //         console.log(singleUserShifts)
        //         GoToSingleShifts()
        //     },
        //     (error) => {
        //         console.log(error)
        //     }
        // )
        //.catch(err => {console.log(err)})
    }

    return (
        <>
            <div className="App-header">
                <h1>Roster</h1>
            </div>
            <Grid textAlign='center' columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Container className="border">
                            {pageChanger()}
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </>
    );
}

export default App;