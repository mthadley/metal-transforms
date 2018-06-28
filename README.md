# Metal Transforms

A collection of transforms for use with [jscodeshift](https://github.com/facebook/jscodeshift).

## Usage

To use, first install jscodeshift:

```
$ yarn global add jscodeshift
```

Then pick a transform and run it:

```
$ jscodeshift /path/to/your/source -t transforms/transform.js
```
