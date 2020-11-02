import React, { Component } from 'react'
import { Button, Grid, Segment, Container, Header } from 'semantic-ui-react'
import moment from 'moment';
moment().format();

class SingleShifts extends Component {
    state = {
        name: "",
        shifts: [],
        allShifts: []
    }

    async componentDidMount() {
        this.setState({name: await this.props.selectedUser})
        const shifts = await this.props.GetSingleShifts(this.state.name)
        const updatedShiftsWithPeriods = this.AddDayOrNight(shifts)
        this.setState({shifts: updatedShiftsWithPeriods})
        const allShifts = await this.props.GetAllShifts()
        const updatedAllShiftsWithPeriods =  this.AddDayOrNight(allShifts.data)
        console.log(updatedAllShiftsWithPeriods)
        this.setState({allShifts: updatedAllShiftsWithPeriods})
    }

    //loops through an array to check what type of shift it is. adds a new object property "period"
    AddDayOrNight = (x) => {
        var newArrayWithDayOrNight = []
        newArrayWithDayOrNight = x.map((single) => {
            var period;
            //constants to dictate if a shift belongs to day or night
            const lunch = moment("12:00 PM", "LT")
            const dinner = moment("6:00 PM", "LT")
    
            //the staff's starting/finishing time in HH:mm a/pm format
            const staffTimeStart = moment(this.ConvertTime(single.time_start, "LT"), "LT")
            const staffTimeFinish = moment(this.ConvertTime(single.time_finish, "LT"), "LT")

            if (staffTimeStart.isSameOrBefore(lunch) && staffTimeFinish.isSameOrBefore(dinner)) {
                period = "day"
            }
            if (staffTimeStart.isSameOrBefore(lunch) && staffTimeFinish.isAfter(dinner)) {
                period = "day & night"
            }
            if (staffTimeStart.isAfter(lunch)) {
                period = "night"
            }
            single["period"] = period
            return single
        })
        return newArrayWithDayOrNight
    }

    ConvertTime = (x, format) => {
        const newTime = moment(x).format(format)
        return newTime
    }

    FormatShift = (x) => {
        const day = this.ConvertTime(x.day, "MMM Do")
        const time_start = this.ConvertTime(x.time_start, "LT")
        const time_end = this.ConvertTime(x.time_finish, "LT")
        const period = x.period
        return(
            <Segment>
                <Header as="h2" textAlign="left">
                    <Header.Content>
                        {time_start} to {time_end}
                    <Header.Subheader>
                        {day}, {period} shift
                    </Header.Subheader>
                    </Header.Content>
                </Header>
            </Segment>
        )
    }


    //x is the current shift and the second param is ENTIRE array of shifts stored in the db.
    FormatStaffOnShift = (x, allShifts) => {
        //staff that are working on the same DAY, but may not necessarily same shift
        var arrayOfSameDay = []
        var arraySeperatedByPeriod;

        //get the date of the current shift
        const date1 = this.ConvertTime(x.day, "MMM Do")
        //making an array of all OTHER shifts that land on the SAME day irrespective of night/day.
        for (let i=0; i<allShifts.length; i++) {
            const date2 = this.ConvertTime(allShifts[i].day, "MMM Do")
            if (date1 === date2) {
                arrayOfSameDay.push(allShifts[i])
            }
        }
        
        var a = arrayOfSameDay.filter((x) => {
            return x.period.includes("day")
        })
        a = a.map((x) => {
            return x.staff_name
        })
        a = a.join(", ")

        var b = arrayOfSameDay.filter((x) => {
            return x.period.includes("night")
        })
        b = b.map((x) => {
            return x.staff_name
        })
        b = b.join(", ")

        if (x.period.includes("day") && x.period.includes("night")) return(
            <Segment.Group>
                <Segment>
                    <Header>Day team</Header>
                    {a}
                </Segment>
                <Segment>
                    <Header>Night team</Header>
                    {a}
                </Segment>
            </Segment.Group>
        )
        if (x.period.includes("day")) return(
            <Segment>
                <Header>Day team</Header>
                {a}
            </Segment>
        )
        if (x.period.includes("night")) return(
            <Segment>
                <Header>Night team</Header>
                {b}
            </Segment>
        )
    }

    LoopingShifts = () => {
        const mappedShifts = this.state.shifts.map((x, i) => {
            return(
                <Grid.Row columns={2}>
                    <Grid.Column className="border">
                        <Container>
                            {this.FormatShift(x)}
                        </Container>
                    </Grid.Column>
                    <Grid.Column className="border">
                        <Container>
                            {this.FormatStaffOnShift(x, this.state.allShifts)}
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            )
        })
        return mappedShifts
    }

    render() { 
        return (
            <div>
                <Button onClick={() => this.props.GoToHome()}>
                    Go home
                </Button>
                <Grid>
                    {this.LoopingShifts()}
                </Grid>
            </div>
        );
    }
}
 
export default SingleShifts;
