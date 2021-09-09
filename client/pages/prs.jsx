import React from 'react';
import PropTypes from 'prop-types';

export default class PrPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prs: [],
      userId: 1
    };
  }

  componentDidMount() {
    fetch(`/api/pr/${this.state.userId}`)
      .then(res => res.json())
      .then(prs => this.setState({ prs }));
  }

  render() {
    return (
    <div className="container">
      <div className="row">
        {
          this.state.prs.map(pr => (
            <div key={pr.prId}>
              <Pr pr={pr}/>
            </div>
          ))
        }
      </div>
      <div>
        <AddPrModal />
      </div>
    </div>
    );
  }
}

class AddPrModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      isOpen: false
    };
  }

  handleOpen() {
    this.setState({ isOpen: true });
  }

  handleClose() {
    this.setState({
      isOpen: false
    });
  }

  render() {
    if (!this.state.isOpen) {
      return (
        <div>
          <button onClick={this.handleOpen}>+ Add PR</button>
        </div>
      );
    }
    return (
      <div>
        <a href="">+ Add PR</a>
        <div className="modal">
          <div className="modal-content">
            <h1>Add PR's</h1>
            <Search />
            <SelectExerciseButton userInput="Hello" />
            <button onClick={this.handleClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}

function Pr(props) {
  const { exercise, reps, weight } = props.pr;
  return (
    <div className="row">
      <h3>{ exercise }</h3>
      <h5>{ reps } RM</h5>
      <h5>{weight}</h5>
    </div>
  );
}

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      filteredExercises: [],
      activeSuggestions: 0,
      showSuggestions: false,
      userInput: ''
    };
    this.onType = this.onType.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/exercise-list')
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));
  }

  onType(event) {
    const userInput = event.currentTarget.value;
    const filteredExercises = this.state.exercises.filter(
      exercise => exercise.exercise.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.setState({
      activeSuggestions: 0,
      filteredExercises,
      showSuggestions: true,
      userInput: event.target.value
    });
  }

  onClick(event) {
    this.setState({
      activeSuggestions: 0,
      filteredExercises: [],
      showSuggestions: false,
      userInput: event.currentTarget.innerText
    });
  }

  render() {
    let listSuggestions;
    if (this.state.showSuggestions && this.state.userInput) {
      if (this.state.filteredExercises.length) {
        listSuggestions = (
          <div>
            <ul className="suggestions">
              {this.state.filteredExercises.map((suggestion, index) => {
                return (
                  <li key={suggestion.exercise} onClick={this.onClick}>
                    {suggestion.exercise}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      } else {
        listSuggestions = (
          <div>
            <div className="no-suggestions">
              <p>No suggestions available</p>
            </div>
          </div>
        );
      }
    }

    return (
      <>
        <input type="text" onChange={this.onType} value={this.state.userInput} />
        {listSuggestions}
      </>
    );
  }
}

Search.propTypes = {
  suggestions: PropTypes.instanceOf(Array)
};

// class SelectExerciseButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userInput: ''
//     };
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleSubmit() {
//     this.setState({
//       userInput: this.props.userInput
//     });
//   }

//   render() {
//     return (
//       <button type="submit">Add</button>
//     );
//   }
// }
