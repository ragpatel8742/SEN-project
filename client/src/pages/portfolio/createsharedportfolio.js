import React, { useState, Fragment,Component} from "react";
import ReactDOM from "react-dom";
import Header from '../../Header'
import axios from 'axios'
import { FormHelperText, Grid, Typography, Container, CssBaseline, TextField, Radio, FormControl, RadioGroup, FormControlLabel, Button} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { blue } from "@material-ui/core/colors";
class CreateSharedPortfolio extends Component{
    constructor(props){
        super(props)
        this.state = {
            loggedin : false,
            email : '',
            owner : '',
            name : '',
            nameError : 'Required Feild',
            ownerError : 'Required Feild',
            commonError :''
        }
    }   

    componentDidMount(){
        axios.get('/user').then( res => {
            if(res.data.status === 'OK'){
                this.setState({loggedin : true})
                this.setState({email : res.data.user.email})
            }
        }).catch(err => {
            this.setState({loggedin : false})
        })
    }

    // On change events
    changeInputs = (e,index) => {

        if(e.target.name === "name") {
            if(e.target.value === ''){
                this.setState({nameError : "Required Feild."}) 
            }else{
                this.setState({name : e.target.value})
                this.setState({nameError : ''})
            }
        }
        
        if(e.target.name === "owner") {
            if(e.target.value === ''){
                this.setState({ownerError : "Required Feild."}) 
            }else{
                this.setState({owner : e.target.value})
                this.setState({ownerError : ''})
            }
        }
    }

    // Saving create ortfolio.
    onSave = (e,index) => {
        axios({
            method: 'post',
            url: '/user/portfolio/requests',
            data: {
                reqFrom : this.state.email,
                reqTo : this.state.owner,
                portfolioName : this.state.name
            }
          }).then(res => { 
              if(res.data.status=="OK"){

              }else{
                this.setState({commonError :  res.data.errors[0]["msg"]})
              }})     
    }
    

    onShow = (e) => {
        // Get Shared Portfolios : 
        axios({
            method: 'post',
            url: '/user/portfolio/specificPort',
            data: {
                owner : this.state.owner,
                portName : this.state.name
            }
          }).then(res => { 
              if(res.data.status=="OK"){

              }else{
                this.setState({commonError :  res.data.errors[0]["msg"]})
              }})
    }
    onDelete = (e) => {
        window.location.reload()
    }
    render(){
        return( 
            <div>
                <br></br>
                <form noValidate>
                    <Grid container>
                        <Grid xs>
                            <TextField  variant = 'outlined' margin = 'normal' required id="owner" label='Owner email' name = 'owner' autoFocus type='text' onChange = {e => {this.changeInputs(e,0)}}></TextField>
                            <FormHelperText error ={true} >{this.state.ownerError} </FormHelperText>
                        </Grid>
                        <Grid xs>
                            <TextField  size="medium" variant = 'outlined' margin = 'normal' required id="name" label='Portfolio Name' name = 'name' autoFocus type='text' onChange = {e => {this.changeInputs(e,0)}}></TextField>
                            <FormHelperText error ={true} >{this.state.nameError} </FormHelperText>
                        </Grid>
                    </Grid>
                    <FormHelperText error ={true} >{this.state.commonError} </FormHelperText>
                    <Box align='center'>
                        <Grid container>
                            <Grid xs={3}></Grid>
                            <Grid xs={1}><Button onClick={this.onDelete} variant='contained' color="error">DELETE</Button></Grid>
                            <Grid xs={1}></Grid>
                            <Grid xs={1}><Button onClick={e => this.onSave()} variant='contained' color="primary">SAVE</Button></Grid>
                            <Grid xs={4}></Grid>
                        </Grid>
                    </Box>
   
                </form>
            </div>
        )
    }
}
export default CreateSharedPortfolio;