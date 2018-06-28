class MyComponent extends Component {
  static PROPS = {
    name: Config.string().required()
  };

  static STATE = {
    loading: Config.boolean().value(false)
  };

  render() {
    return <h1>{this.props.name}</h1>;
  }
}
