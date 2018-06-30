function createClass1() {
  class MyComponent extends Component {
    render() {
      return <h1>{this.props.name}</h1>;
    }
  }
}

function createClass2() {
  class MyComponent extends Component {
    static PROPS = {
      name: Config.string().required()
    };

    render() {
      return <h1>{this.props.name}</h1>;
    }
  }
}
