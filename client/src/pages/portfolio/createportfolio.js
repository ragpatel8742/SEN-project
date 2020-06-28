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

class CreatePortfolio extends Component{
    constructor(props){
        super(props)
        this.state = {
            name : '',
            items : [
                {
                    symbol : '',
                    quantity : '',
                    price : ''
                }
            ],
            nameError : '* Required Feild',
            itemError : [
                {
                    symbol : '* Required Feild',
                    quantity : '* Required Feild',
                    price : '* Required Feild'
                }
            ],
            commonError : ''
        }
    }   

    componentDidMount(){

        //Get User
        axios.get('/user').then( res => {
            if(res.data.status === 'OK'){
                this.setState({loggedin : true})
                this.setState({email : res.data.user.email})
            }
        }).catch(err => {
            this.setState({loggedin : false})
        })


    }

    // Add Item
    onAdd = (e) =>{
        if(this.state.items.length === 0)
            this.setState({items : [...this.state.items,{symbol:'',price:'',quantity:''}]})
        console.log(e.target)
    }

    // On change events
    changeInputs = (e,index) => {

        if(e.target.name === "name") {
            if(e.target.value === ''){
                this.setState({nameError : "* Required feild"}) 
            }else{
                this.setState({name : e.target.value})
                this.setState({nameError : ''})
            }
        }
        
        let newitems2 = this.state.items
        let newitems = this.state.itemError

        newitems.map((p1,idx) => {
            if(idx === index){
                if(e.target.value === ''){
                    p1[`${e.target.name}`] = "* Required feild"
                }else{
                    if(e.target.name === "symbol"){
                       p1[`${e.target.name}`] = '' 
                    }
                    newitems2[index][`${e.target.name}`] = e.target.value
                }
            } 
        })
        this.setState({itemError : newitems})
        this.setState({items : newitems2})
    }

    // On key press
    onPress = (e,index) => {
        let newitems = this.state.itemError;
        newitems.map((p1,idx) => {
            if(idx === index){
                if(e.which == 46 || e.which == 48 || e.which == 49 || e.which == 50 || e.which == 51 || e.which == 52 || e.which == 53 || e.which == 54 || e.which == 55 || e.which == 56 || e.which == 57){
                    if((e.which == 46 ) && e.target.name === "quantity"){
                        p1[`${e.target.name}`] = " Quantity should be INTEGER."
                    }
                    else{
                        p1[`${e.target.name}`] = ""
                    }
                }else{
                    p1[`${e.target.name}`] = "This feild should be in numeric format."
                }
            }
        })
        this.setState({itemError : newitems})
    }

    // Saving create portfolio.
    onSave = (e,index) => {
        let listitems = []
        this.state.items.map((p2,idx) => {
            if(p2.symbol==='#'){

            }else{
                listitems.push(p2)
            }
        })
        axios.post('/user/portfolio/add',{
            "portfolio" : {
                "name":this.state.name,
                "items":listitems                
            }
        }).then(res => {
            if(res.data.status === "FAILED"){
                if(res.data.errors[0].msg === `Portfolio ${this.state.name} already exists!}`){
                    this.setState({nameError : res.data.errors[0].msg})
                }else{
                    this.setState({commonError : res.data.errors[0].msg})
                }
                console.log(res.data.errors[0].msg)
            }else{
                this.props.onsave()
                window.location.reload()
            }
        })
        .catch(err => this.state.name = err.messsage)
    }
    
    removeItem = (e,index) => {
        let newitems =this.state.items
        let newitemsError = this.state.itemError
        newitems[index].symbol='#'
        newitems[index].quantity=null
        newitems[index].price=null
        newitemsError[index].symbol='#'
        newitemsError[index].quantity=null
        newitemsError[index].price=null
        this.setState({items:newitems})
        this.setState({itemsError:newitemsError})
    }

    addItem = (e) => {
        console.log(this.state.items.length)
        this.setState({items:[...this.state.items,{symbol:'',quantity:'',price:''}]})
        this.setState({itemError:[...this.state.itemError,{symbol:'Required feild',quantity:'Required feild',price:'Required feild'}]})
    }

    onDelete = (e) => {
        window.location.reload()
    }
    render(){
        return( 
            <div>
                <form noValidate>
                    <TextField  variant = 'outlined' margin = 'normal' required id="name" label='Portfolio Name' name = 'name' autoFocus type='text' onChange = {e => {this.changeInputs(e,0)}}></TextField>
                    <FormHelperText error={true}>{this.state.nameError}</FormHelperText>
                    {this.state.items.map((item,index) => 
                        (!(item.symbol==='#') && 
                            (                        
                            <Fragment key={`${item}~${index}`}>
                            <Grid container>
                                <Grid xs={3}> <TextField defaultValue={item.symbol} name="symbol" label="Symbol" varient='outlined' onChange={e => this.changeInputs(e,index)}> </TextField>
                                <FormHelperText error={true} color="red" >{this.state.itemError[`${index}`].symbol}</FormHelperText></Grid>
                                <Grid xs={3}> <TextField defaultValue={item.symbol} marginLeft="10" name="quantity" varient='outlined' label="Quantity" onKeyPress={e => this.onPress(e,index)} onChange={e => this.changeInputs(e,index)}> </TextField>
                                <FormHelperText error={true} color="red" >{this.state.itemError[`${index}`].quantity}</FormHelperText></Grid>
                                <Grid xs={3}> <TextField name="price" label="Price" varient='outlined'  onKeyPress={e => this.onPress(e,index)} onChange={e => this.changeInputs(e,index)}> </TextField>
                                <FormHelperText error={true} color="red" >{this.state.itemError[`${index}`].price}</FormHelperText></Grid>
                                {!(this.state.items.length===1) && <Grid xs={1}> <Button onClick={e => this.removeItem(e,index)} color="secondary">Remove</Button></Grid>}
                            </Grid>
                        </Fragment>                        
                            ))
                    )}           
                    <Button onClick={this.addItem} color="primary">Add Stock</Button>
                    <FormHelperText error={true}>{this.state.commonError}</FormHelperText>                    
                    <Box align='center'>
                        <Grid container>
                            <Grid xs={3}></Grid>
                            <Grid xs={1}><Button onClick={e => this.onDelete()} variant='contained' color="error">DELETE</Button></Grid>
                            <Grid xs={1}></Grid>
                            <Grid xs={1}><Button onClick={this.onSave} variant='contained' color="primary">SAVE</Button></Grid>
                            <Grid xs={4}></Grid>
                        </Grid>
                    </Box>
                </form>
            </div>
        )
    }
}
export default CreatePortfolio;