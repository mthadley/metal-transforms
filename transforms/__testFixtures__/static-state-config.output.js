class MyComponent extends Component {
  static PROPS = {
    name: Config.string().required()
  };

  render() {
    return <h1>{this.props.name}</h1>;
  }
}
