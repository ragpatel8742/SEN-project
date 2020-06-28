import React, { useState, Fragment,Component} from "react";
import ReactDOM from "react-dom";
import Header from '../../Header'
import axios from 'axios'
import { Grid, Typography, Container, CssBaseline, TextField, Radio, FormControl, RadioGroup, FormControlLabel, Button} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { blue } from "@material-ui/core/colors";
import Payoff from './chart'
var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class SinglePortfolio extends Component{
    constructor(props){
        super(props)
        this.state = {
            name : this.props.portfolio.name,
            items : this.props.portfolio.items,
            stocks : {
            },
            profits : {
            },
            items2 : []
        }
        this.fun2()
        console.log(this.state.items)
    }

    fun2 = () => {
        let newitems = []
        this.state.items.map((p1,idx) => {
            axios.get(`/api/quote/${p1.symbol}`).then(res => {
                let p2 =p1
                let newstocks = this.state.stocks
                newstocks[`Item-${idx}`] = res.data.price
                this.setState( {stocks : newstocks})
                let newprofits = this.state.profits
                newprofits[`Item-${idx}`]=this.calcProfit(p1,idx)
                this.setState( {profits :newprofits})
                p2.profit = this.calcProfit(p1,idx)
                newitems.push(p2)
                this.setState({items2 : [...this.state.items2,p2]})
            })
        })
    }
    ondelete = () =>{
        this.props.ondelete(this.state.name)
    }

    onedit = () => {
        let p = {
            "name" : this.state.name,
            "items" : this.state.items
        }
        this.props.onedit(p)
    }

    calcProfit = (item,idx) => {
        return item.quantity*(this.state.stocks[`Item-${idx}`]-item.price)        
    }
    render(){
        return(
                <Box border={2} borderColor={blue} marginBottom={2}>
                    <Typography align='center' variant='h6'>{this.state.name}</Typography>
                        <Grid container>
                        <Grid item xs={9} >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><Typography  align='center' variant='h8'>Items</Typography></TableCell>
                                            <TableCell><Typography  align='center' variant='h8'>Stock</Typography></TableCell>
                                            <TableCell><Typography align='center' variant='h8'>Buy Price</Typography></TableCell>
                                            <TableCell><Typography align='center' variant='h8'>Quantity</Typography></TableCell>
                                            <TableCell><Typography align='center' variant='h8'>Total Buy Price</Typography></TableCell>
                                            <TableCell><Typography align='center' variant='h8'>Current Stock Price</Typography></TableCell>
                                            <TableCell><Typography align='center' variant='h8'>Total Sell Price</Typography></TableCell>
                                            <TableCell><Typography align='center' variant='h8'>Profit</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.items.map((p2,idx) => (
                                            <TableRow>
                                                <TableCell><Typography align='center' variant='h8'>Item-{idx+1}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{p2.symbol}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{p2.price}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{p2.quantity}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{p2.price*p2.quantity}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{this.state.stocks[`Item-${idx}`]}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{p2.quantity*this.state.stocks[`Item-${idx}`]}</Typography></TableCell>
                                                <TableCell><Typography align='center' variant='h8'>{this.state.profits[`Item-${idx}`]}</Typography></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={3}>
                        <Box bgcolor="" p={1} my={0.5} align='right'>
                              <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick = {this.ondelete}
                                style={{textTransform : 'none'}}
                            >
                              Delete
                              </Button>
                            
                              </Box>      
                        
                            <Payoff  fun2= {this.fun2} portfolio={this.state.items}></Payoff>
                        </Grid>
                        
                    </Grid>

                </Box>                
        )
    }
}
export default SinglePortfolio;