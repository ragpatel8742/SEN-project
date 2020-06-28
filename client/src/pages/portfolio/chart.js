import CanvasJSReact  from './canvasjs.react';
import { Grid} from "@material-ui/core";

var React = require('react');
var Component = React.Component;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints =[];

CanvasJS.addColorSet("colors",["#0000FF","#DC143C","#7FFF00","#FF69B4","#006400"])

class Payoff extends Component {
	constructor(props){
		super(props)

		this.props.fun2()
		this.state = {
			items : this.props.portfolio,
			profit : this.props.profits,
			profit2 : []
		}
	}
	componentDidMount(){
		let newitems = []
		let sum = 0
		let newprofits = []
		let sum2 = 0
		this.state.items.map((p1) => {console.log(p1); sum +=p1.price*p1.quantity; sum2+=p1.profit})
		this.state.items.map((p1,idxp) => {	
			var x = ((p1.price*p1.quantity)/sum)*100
			var y1=x.toFixed(2)
			newitems.push({
				y:y1,
				label : `Item - ${idxp+1}`
			})
			console.log(sum2)
			var x2 = ((p1.profit)/sum2)*100
			var y2=x2.toFixed(2)
			newprofits.push({
				y: y2,
				label : `Item - ${idxp+1}`
			})
		})
		console.log(this.state.items)
		this.setState({items:newitems})
		this.setState({profit2 : newprofits})		
	}
    render() {
		const options = {
			animationEnabled: true,

			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 11,
				indexLabel: "{label} - {y}%",
				dataPoints: this.state.items
			}]
			
		}

		
		const options2 = {
			animationEnabled: true,

			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 11,
				indexLabel: "{label} = {y}%",
				dataPoints: this.state.profit2
			}]
		}
		return (
		<div>
			<Grid container>
				<Grid xs={12}>
				<CanvasJSChart options = {options}/>
				</Grid>
			</Grid>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
export default Payoff;