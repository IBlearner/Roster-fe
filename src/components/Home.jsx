import React, { Component } from 'react'
import { Button, Grid } from 'semantic-ui-react'
class Home extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        // console.log(this.props.GetAllUsers())
        // const a = this.props.GetAllUsers()
        // this.setState({data: a})
        fetch(`http://localhost:3333/users`, {method: "GET", mode: "cors"})
        .then(res => {return res.json()})
        .then(result => {
            console.log(result)
            const processedResults = this.ConvertObjToArray(result)
            this.setState({data: processedResults})})
        .catch(err => {console.log(err)})
    }

    ConvertObjToArray = (x) => {
        var users = []
        for (let i = 0; i < x.data.length; i++) {
            users.push(x.data[i].name)
        }
        return users
    }

    LoopingUsers = () => {
        const mappedUsers = this.state.data.map((x, i) => {
            return(
                    <Grid.Column>
                        <Button onClick={() => this.props.GoToSingleShifts(x)}>
                            {x}
                        </Button>
                    </Grid.Column>
            )
        })
        return mappedUsers
    }

    render() { 
        return (
            <>
                <Grid columns={3} celled>
                    <Grid.Row>
                        {this.LoopingUsers()}
                    </Grid.Row>
                </Grid>
            </>
        );
    }
}
 
export default Home;
