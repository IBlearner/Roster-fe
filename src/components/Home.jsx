import React, { Component } from 'react'
import { Button, Grid } from 'semantic-ui-react'
class Home extends Component {
    state = {
        data: []
    }

    async componentDidMount() {
        const rawResponse = await this.props.GetAllUsers()
        const response = this.ConvertObjToArray(rawResponse)
        this.setState({data: response})
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
