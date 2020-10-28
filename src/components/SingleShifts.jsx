import React, { Component } from 'react'
import { Button, Grid } from 'semantic-ui-react'
class SingleShifts extends Component {
    state = {
        name: "bob",
        shifts: []
    }

    async componentDidMount() {
        this.setState({name: await this.props.selectedUser})
        const shifts = await this.props.GetSingleShifts(this.state.name)
        this.setState({shifts: shifts})

        console.log(this.state.shifts)
        
        // console.log(this.props.GetAllUsers())
        // const a = this.props.GetAllUsers()
        // this.setState({data: a})
        // const data = await this.props.GetSingleShifts()
        // this.setState({data: data})
    }

    ConvertObjToArray = (x) => {
        var users = []
        for (let i = 0; i < x.data.length; i++) {
            users.push(x.data[i].name)
        }
        return users
    }

    LoopingShifts = () => {
        const mappedShifts = this.state.shifts.map((x, i) => {
            return(
                    <Grid.Column>
                        {x.day}
                    </Grid.Column>
            )
        })
        return mappedShifts
    }

    render() { 
        return (
            <>
                <Button onClick={() => this.props.GoToHome()}>
                    Go home
                </Button>
                <p>
                    {this.state.name}
                    {this.LoopingShifts()}
                </p>
                <Grid columns={3} celled>
                    <Grid.Row>
                        
                    </Grid.Row>
                </Grid>
            </>
        );
    }
}
 
export default SingleShifts;
