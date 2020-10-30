import React, { Component } from 'react'
import { Button, Grid, Segment, Container, Header, Icon } from 'semantic-ui-react'
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
        this.setState({allShifts: updatedAllShiftsWithPeriods})
    }

    //loops through an array to check what type of shift it is. adds a new object property "period"
    AddDayOrNight = (x) => {
        const newArrayWithDayOrNight = x.map((single => {
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
        }))
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
            <Header as="h2" textAlign="left">
                <Header.Content>
                    {time_start} to {time_end}
                <Header.Subheader>
                    {day}, {period} shift
                </Header.Subheader>
                </Header.Content>
            </Header>
        )
    }

    //THERE IS UNNESSECARY CODE HERE. TAKE IT OUT AND MAKE TWO ARRAYS, DAY OR NIGHT.
    //x is the current shift and y is the array of ALL shifts
    FormatStaffOnShift = (x, y) => {
        var arrayOfSameDay = []
        var arrayOfSameShift = []
        var day = false
        var night = false
        const lunch = moment("12:00 PM", "LT")
        const dinner = moment("6:00 PM", "LT")

        //get the date of the current shift
        const date1 = this.ConvertTime(x.day, "MMM Do")
        //making an array of all OTHER shifts that land on the SAME day irrespective of night/day.
        for (let j=0; j<y.length; j++) {
            const date2 = this.ConvertTime(y[j].day, "MMM Do")
            if (date1 === date2) {
                arrayOfSameDay.push(y[j])
            }
        }

        //the staff's starting/finishing time in HH:mm a/pm format
        const staffTimeStart = moment(this.ConvertTime(x.time_start, "LT"), "LT")
        const staffTimeFinish = moment(this.ConvertTime(x.time_finish, "LT"), "LT")

        if (staffTimeStart.isSameOrBefore(lunch) && staffTimeFinish.isSameOrBefore(dinner)) {
            console.log("ITS A DAY SHIFT")
            day = true
        }
        if (staffTimeStart.isSameOrBefore(lunch) && staffTimeFinish.isAfter(dinner)) {
            console.log("ITS A DUO SHIFT")
            day = true
            night = true
        }
        if (staffTimeStart.isAfter(lunch)) {
            console.log("ITS A NIGHT SHIFT")
            night = true
        }

        for (let i=0; i<arrayOfSameDay.length; i++) {
            const time_start = moment(this.ConvertTime(arrayOfSameDay[i].time_start, "LT"), "LT")
            if (day) {
                if (time_start.isSameOrBefore(lunch)) arrayOfSameShift.push(arrayOfSameDay[i].staff_name)
            }
            if (night) {
                if (time_start.isAfter(lunch)) arrayOfSameShift.push(arrayOfSameDay[i].staff_name)
            }
        }

        return arrayOfSameShift.join(", ")
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
                        <Segment>
                            {this.FormatStaffOnShift(x, this.state.allShifts)}
                        </Segment>
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
