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
import SinglePortfolio from './singleportfolio'
import CreatePortfolio from './createportfolio'
import CreateSharedPortfolio from './createsharedportfolio'
import createPalette from "@material-ui/core/styles/createPalette";
//import PieChart from "@bit/mui-org.material-ui-icons.pie-chart";

class Portfolio extends Component {

    constructor(props){
        super(props);
        this.state = {
            loggedin : false,
            email : '',
            portfolios : [],
            createportfolios : [],
            createsharedportfolios : [],
            error1 : '',
            sharedportfolios : []
        };
    }

    onUpdate(){
        axios.get('/user/portfolio').then(res => {this.setState({portfolios:res.data.portfolios})})
        axios.get('/user/portfolio/shared').then(res => { this.setState({sharedportfolios:res.data.ports})})
    
    }
    componentDidMount(){      
        // Get User : 
        axios.get('/user').then( res => {
            if(res.data.status === 'OK'){
                this.setState({loggedin : true})
                this.setState({email : res.data.user.email})
            }
        }).catch(err => {
            this.setState({loggedin : false})
        })


        // Get All portfolios : 
        axios.get('/user/portfolio').then(res => {this.setState({portfolios:res.data.portfolios})})
        // Get All shared portfolios : 
        axios.get('/user/portfolio/shared').then(res => {
            if(res.data.status === "FAILED"){}
            else{
                this.setState({sharedportfolios:res.data.ports})
            }
        })
    }
    oncall = () => {
        axios.get('/user/portfolio').then(res => {this.setState({portfolios:res.data.portfolios})})   
    }

    Delete = (name) => {
        this.state.portfolios.map((p1,idx) => {
            if(p1.name === name){
                axios.post('/user/portfolio/remove',{
                    "name" : name
                }).then(res => {
                    console.log(res)
                })
            }
        })
        window.location.reload()
    }
    Edit = (p) => {
        this.setState({createportfolios : [...this.state.createportfolios,p]})
    }
    onCreate = () => {
        if(this.state.createportfolios.length===0){
            this.setState({createportfolios : [...this.state.createportfolios,'Create']})
        }else{
            this.setState({error1 : "First save current Portfolio. Only after you can create a new Portfolio."})
        }
    }

    onCreateShared = () => {
        if(this.state.createsharedportfolios.length===0){
            this.setState({createsharedportfolios : [...this.state.createsharedportfolios,'Create']})
        }else{
            this.setState({error1 : "First save current Portfolio. Only after you can create a new Portfolio."})
        }
    }

    deleteItem = (e) => {
        let list =[]
        this.setState({createportfolios : list})
        window.location.reload()
    }
    render(){
        return(
            <div>
                <Header/>
                <Grid container>
                    <Grid xs={1}></Grid>
                    <Grid xs={10}>
                    <CssBaseline/>
                    <br></br>
                    <Box align='center'> 
                        <Button marginLeft={2} variant='contained' align='center' onClick={this.onCreate} > Create A Portfolio</Button>
                    </Box>
                    <FormHelperText>{this.state.error1}</FormHelperText> 
                    {this.state.createportfolios.map(p1 => (<Box borderBottom={1}>
                        <CreatePortfolio onsave={this.oncall} onDelete={this.deleteItem}/><br></br>
                        </Box>))}
                    
                    <br></br>
                    <Box align='center'> 
                        <Button marginLeft={2} variant='contained' align='center' onClick={this.onCreateShared} > Request for shared Portfolio</Button>
                    </Box>
                    {this.state.createsharedportfolios.map(p1 => (<Box borderBottom={1}>
                        <CreateSharedPortfolio onsave={this.oncall} onDelete={this.deleteItem}/><br></br>
                        </Box>))}                    
                    <br></br>
                    
                    <Typography align='center' variant='h4'>My Portfolios</Typography>
                    <Box>
                    {
                        this.state.portfolios.map((p1,idx) => (<SinglePortfolio ondelete={this.Delete} onedit ={this.Edit} portfolio={p1}/>))
                    }</Box>
                    <br></br>
                    <br></br>
                    <Typography align='center' variant='h4'>Shared Portfolios</Typography>
                    <Box>
                    {
                       this.state.sharedportfolios.map((p1,idx) => (<SinglePortfolio ondelete={this.Delete} onedit ={this.Edit} portfolio={p1}/>))
                    }
                   </Box>
                    </Grid>
                </Grid>

            </div>
        )
    }              
}
export default Portfolio;