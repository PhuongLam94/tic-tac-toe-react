import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const squareNum = 5;
const incArray = [[0, 1], [1, 0], [1, 1], [-1,1]];
function Square(props){
	var tempI = props.row, tempJ = props.col;
    return (
      <button className={"square "+ props.row+" "+ props.col} onClick={() => props.onClick(tempI, tempJ)}>
        {props.value}
      </button>
    );
  }


class Board extends React.Component {
	
	
  renderSquare(i, j) {

    return <Square value={(this.props.squares[i])[j]} onClick={() => this.props.onClick(i, j)}/>;
  }
  render() {
  	var rows = [];
  	for (var i = 0; i<squareNum; i++){
       	var cells = [];
        for (var j = 0; j<squareNum; j++){
        	var tempI = i, tempJ = j;
        	var tempCell = <Square key = {j} row={i} col = {j} value={(this.props.squares[i])[j]} onClick={(i, j) => this.props.onClick(i, j)}/>;
        	cells.push(tempCell);
        }
        var tempRow = <div key = {i} className="board-row"> {cells}</div>
        rows.push(tempRow);
      }
    return (
      <div>
      	{rows}
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(){
		super();
		this.state = {
			history: null,
			stepNumber: null,
			xIsNext: null
		}
		initState(this);
	}
	
  render() {
  	//console.log(this.state.history[this.state.history.length-1])
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	const moves = history.map((step, move) => {
  		
  		const desc = move ? 'Move #'+move:'Game start';
  		let txt;
  		if(move == this.state.stepNumber) 
  			txt = <b>{desc}</b> 
  		else txt = <span>{desc}</span>
  		return (

  			<li key={move}>
  				<a href="#" onClick = {() => this.jumpTo(move)}>{txt}</a>
  			</li>
  		);
  	});

  	let status;
  	if (winner){
  		status = 'Winner: ' + winner;
  	} else {
  		status = 'Next player: '+(this.state.xIsNext ?'X':'O');
  	}
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i, j) => this.handleClick(i, j)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <a href="#" onClick={() => initState(this)}>Restart</a>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  
  jumpTo(step) {
  	this.setState(
  	{
  		stepNumber: step,
  		xIsNext: (step %2) ? false:true
  	}
  	)
  	console.log(this.state.stepNumber, this.state.xIsNext);
  }
  handleClick(i, j) {
  	
  	const history = this.state.history.slice(0,this.state.stepNumber+1);
  	const current = history[this.state.stepNumber];
  	const squares = [];
  	for (var p =0; p<squareNum; p++){
  		var tempArr = current.squares[p].slice();
  		squares.push(tempArr);
  	}
  	if (calculateWinner(squares) || (squares[i])[j]){
  		return;
  	}
  	squares[i][j] = this.state.xIsNext ?'X':'O';
  	this.setState({
  		history: history.concat([
  			{squares: squares}
  		]),
  		stepNumber: history.length,
  		xIsNext: !this.state.xIsNext
  	});
  }
}
function initState(game){
		var squares = [];
		for (var i=0; i<squareNum; i++){
			var tempArr = Array(squareNum).fill(null);
			squares.push(tempArr);
		}
		game.setState = {
			history: [
				{
					squares: squares
				}
			],
			stepNumber: 0,
			xIsNext: true
		};
	}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);
function testNumValid(num, max=squareNum-1, min=0){
	return num<=max && num >= min;
}
function testTheLine(squares, numToWin, i, j,incI, incJ){
	var win = true;
	for (var q =1; q<numToWin; q++){
		if (!testNumValid(i+incI*q) || !testNumValid(j+incJ*q) || squares[i+incI*q][j+incJ*q] !== squares[i][j]){
			win = false;
			break;
		}
	}
	return win;
}
function testMultiLine(squares, numToWin, i, j){
	for (var k = 0; k<incArray.length; k++){
		if (testTheLine(squares, numToWin, i, j, incArray[k][0], incArray[k][1])){
			return squares[i][j];
		}
	}
	return null;
}
function calculateWinner(squares) {
	const numToWin = squareNum>=5?5:squareNum;
  for (var i=0; i<squareNum; i++){
  	for (var j = 0; j<squareNum; j++){
  		if (squares[i][j]){
  			var result = testMultiLine(squares, numToWin, i, j);
  			if(result)
  				return result;
  			
  		}
  	}
  }
  return null;
}

