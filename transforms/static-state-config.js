/**
 * A transform that converts object-assigned PROPS configuraiton
 * to class-based static initialized configuration. In other words...
 *
 * It should convert this:
 *
 *   MyComponent.PROPS = {
 *     foo: Config.string().required()
 *   };
 *
 * To this:
 *
 *   class MyComponent extends Component {
 *     static PROPS = {
 *       foo: Config.string().required()
 *     }
 *   }
 */

const PROP_NAMES = ['STATE', 'PROPS'];

function isStateProperty(name) {
  return PROP_NAMES.includes(name);
}

module.exports = (file, api) => {
  const j = api.jscodeshift;

  const root = j(file.source);

  const classMap = new Map();

  const removedConfigs = root
    .find(j.MemberExpression)
    .filter(path => isStateProperty(path.value.property.name))
    .forEach(path => {
      const {value} = path.parent;
      const className = value.left.object.name;

      const props = classMap.get(className) || [];

      props.push({
        configNode: value.right,
        name: value.left.property.name
      });

      classMap.set(className, props);
    })
    .map(path => path.parent)
    .remove();

  return root
    .find(j.ClassDeclaration)
    .filter(({value}) => classMap.has(value.id.name))
    .forEach(({value}) => {
      const props = classMap.get(value.id.name).concat().reverse();

      for (const {name, configNode} of props) {
        const body = value.body.body;

        body.unshift(
          j.classProperty(
            j.identifier(name), /* key */
            configNode,         /* value expression */
            null,               /* type annotation */
            true                /* static */
          )
        );
      }
    })
    .toSource();
}
