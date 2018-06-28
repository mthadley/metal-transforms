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

function isStateProperty(name) {
  return name === 'STATE' || name === 'PROPS';
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

      classMap.set(value.left.object.name, {
        configNode: value.right,
        name: value.left.property.name
      });
    })
    .map(path => path.parent)
    .remove();

  return root
    .find(j.ClassDeclaration)
    .filter(({value}) => classMap.has(value.id.name))
    .forEach(({value}) => {
      const {name, configNode} = classMap.get(value.id.name);

      const body = value.body.body;

      body.unshift(
        j.classProperty(
          j.identifier(name), /* key */
          configNode,         /* value expression */
          null,               /* type annotation */
          true                /* static */
        )
      )
    })
    .toSource();
}
